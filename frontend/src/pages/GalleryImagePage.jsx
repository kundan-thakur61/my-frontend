import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSmartphone, FiShoppingBag } from 'react-icons/fi';
import collectionAPI from '../api/collectionAPI';
import mobileAPI from '../api/mobileAPI';
import { resolveImageUrl, formatPrice } from '../utils/helpers';
import { addToCart } from '../redux/slices/cartSlice';
import { FALLBACK_COLLECTION_MAP } from '../data/fallbackCollections';
import { FALLBACK_MOBILE_COMPANIES } from '../data/fallbackMobileCompanies';

const COLLECTION_CASE_PRICE = 299;
const DEFAULT_FRAME = '/frames/frame-1-fixed.svg';

const normalizeHandle = (value = '') => (
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
);

const slugifyId = (value) => {
  const parsed = String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '') || 'x';
  return parsed;
};

const materialOptions = [
  { id: 'matte', label: 'Glossy Metal', blurb: 'Smooth aur shiny look Strong & durable' },
  { id: 'gloss', label: 'Glossy Metal + Gel', blurb: 'Transparent layer Extra shine Design  3D / premium protective' },
  // { id: 'leather', label: 'Vegan Leather', blurb: 'Wrap finish with stitched rim.' },
];

const GalleryImagePage = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [search] = useSearchParams();
  const fallback = useMemo(() => FALLBACK_COLLECTION_MAP[normalizeHandle(handle)] || null, [handle]);
  const [collection, setCollection] = useState(fallback);
  const [loading, setLoading] = useState(!fallback);
  const [selectedImage, setSelectedImage] = useState(() => location.state?.selectedImage || null);
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0].id);
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    let ignore = false;
    const assignFromData = (data) => {
      setCollection(data);
      const fromQuery = search.get('imageId');
      if (fromQuery) {
        const image = data?.images?.find((img) => slugifyId(img._id || img.publicId || img.url) === fromQuery);
        if (image) {
          setSelectedImage(image);
          return;
        }
      }
      if (!selectedImage && data?.images?.length) {
        setSelectedImage(data.images[0]);
      }
    };

    if (fallback) {
      assignFromData(fallback);
    }

    const fetchCollection = async () => {
      if (!handle) return;
      try {
        const res = await collectionAPI.getByHandle(handle);
        const data = res?.data?.data?.collection;
        if (!ignore && data) {
          assignFromData(data);
        }
      } catch (err) {
        if (!ignore) setCatalogError(err.response?.data?.message || 'Unable to load collection');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (!fallback || (!selectedImage && search.get('imageId'))) {
      fetchCollection();
    } else {
      setLoading(false);
    }
    return () => { ignore = true; };
  }, [handle, fallback, selectedImage, search]);

  useEffect(() => {
    let ignore = false;
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const response = await mobileAPI.getCompanies({ limit: 100 });
        if (ignore) return;
        const fetched = response?.data?.data?.companies || [];
        if (fetched.length) {
          setCompanies(fetched);
        } else {
          setCompanies(FALLBACK_MOBILE_COMPANIES);
          setCatalogError('Live catalog is offline, showing most requested devices.');
        }
      } catch (err) {
        if (ignore) return;
        setCompanies(FALLBACK_MOBILE_COMPANIES);
        setCatalogError('Live catalog is offline, showing most requested devices.');
      } finally {
        if (!ignore) setLoadingCompanies(false);
      }
    };
    fetchCompanies();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    if (!selectedCompany) {
      setModels([]);
      setSelectedModel(null);
      setLoadingModels(false);
      return;
    }
    if (selectedCompany.__isFallback) {
      const fallbackModels = selectedCompany.models || [];
      setModels(fallbackModels);
      setSelectedModel(fallbackModels[0] || null);
      setLoadingModels(false);
      return;
    }
    let cancelled = false;
    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const response = await mobileAPI.getModels({ company: selectedCompany._id, limit: 200 });
        const fetchedModels = response?.data?.data?.models || [];
        if (!cancelled) {
          setModels(fetchedModels);
          setSelectedModel(fetchedModels[0] || null);
        }
      } catch (err) {
        if (!cancelled) {
          setModels([]);
          setSelectedModel(null);
          toast.error('Unable to load models for this brand. Please try again.');
        }
      } finally {
        if (!cancelled) setLoadingModels(false);
      }
    };
    fetchModels();
    return () => { cancelled = true; };
  }, [selectedCompany]);

  const selectedImageUrl = useMemo(() => {
    if (!selectedImage) return '';
    const source = typeof selectedImage === 'string'
      ? selectedImage
      : selectedImage.url || selectedImage.secure_url || selectedImage.path || selectedImage.publicUrl || selectedImage.previewUrl || '';
    return resolveImageUrl(source);
  }, [selectedImage]);

  const selectedFrame = useMemo(() => {
    const candidate = selectedModel?.framePath
      || (selectedModel?.images?.[0] || null)
      || selectedCompany?.previewFrame
      || DEFAULT_FRAME;
    const resolved = resolveImageUrl(candidate);
    return resolved || DEFAULT_FRAME;
  }, [selectedModel, selectedCompany]);

  const builderReady = Boolean(selectedImage && selectedCompany && selectedModel);

  const buildCartBlueprint = () => {
    if (!collection || !selectedImage || !selectedCompany || !selectedModel) return null;
    const baseId = slugifyId(collection._id || collection.handle || 'collection');
    const modelKey = slugifyId(selectedModel._id || selectedModel.slug || selectedModel.name || 'model');
    const imageKey = slugifyId(selectedImage._id || selectedImage.publicId || selectedImage.url || selectedImage.caption || 'art');
    const productId = `custom_collection_${baseId}_${modelKey}_${imageKey}`;
    const variantId = `${productId}_variant`;
    const product = {
      _id: productId,
      title: `${collection.title} - Custom Case`,
      brand: selectedCompany.name,
      model: selectedModel.name,
      material: selectedMaterial,
      design: {
        imgSrc: selectedImageUrl,
        frame: selectedFrame,
        transform: { x: 0, y: 0, scale: 1 },
        meta: {
          collectionId: collection._id,
          collectionHandle: collection.handle,
          collectionTitle: collection.title,
          imageId: selectedImage._id || selectedImage.publicId || selectedImage.url || imageKey,
          company: selectedCompany.name,
          model: selectedModel.name,
          material: selectedMaterial,
        },
      },
    };
    const variant = {
      _id: variantId,
      price: COLLECTION_CASE_PRICE,
      stock: 50,
      color: selectedModel.color || 'Matte Black',
      name: 'Custom Print',
    };
    return { product, variant };
  };

  const handleCartAction = (mode = 'cart') => {
    const blueprint = buildCartBlueprint();
    if (!blueprint) {
      toast.info('Pick an artwork, material, brand, and model to continue.');
      return;
    }
    dispatch(addToCart({ ...blueprint, quantity: 1 }));
    if (mode === 'buy') {
      toast.success('Design locked! Redirecting to checkout.');
      navigate('/checkout');
    } else {
      toast.success('Design added to your cart.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">Loading gallery...</div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-2xl font-semibold text-gray-900">Collection unavailable</p>
        <p className="text-gray-600 mt-2">Try heading back to the collection page.</p>
        <button
          type="button"
          className="mt-4 px-6 py-3 rounded-full bg-primary-600 text-white font-semibold"
          onClick={() => navigate(`/collection/${handle}`)}
        >
          Back to collection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-3 text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-600 font-semibold">
            <FiArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Preview & Lock</span>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 space-y-8">
        <div className="bg-white rounded-4xl shadow-xl p-6 sm:p-8">
         

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-3xl border border-gray-100 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Selected artwork</p>
                {selectedImage ? (
                  <>
                    <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 aspect-[3/4] flex items-center justify-center">
                      <img
                        src={selectedImageUrl}
                        alt={selectedImage.caption || collection.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    {selectedImage.caption && (
                      <p className="mt-3 text-sm text-gray-600">{selectedImage.caption}</p>
                    )}
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                      onClick={() => navigate(`/collection/${handle}`)}
                    >
                     Back
                    </button>
                  </>
                ) : (
                  <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
                    Select an image from the collection page to continue.
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-gray-100 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Step 3</p>
                <h3 className="text-xl font-semibold text-gray-900 mt-1">Choose material</h3>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  {materialOptions.map((option) => {
                    const active = selectedMaterial === option.id;
                    return (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => setSelectedMaterial(option.id)}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${active ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-primary-300'}`}
                      >
                        <p className="font-semibold">{option.label}</p>
                        <p className="text-sm text-gray-500">{option.blurb}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 p-6 space-y-6">
              <div>
                {/* <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Step 4</p> */}
                <label className="mt-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <FiSmartphone className="text-primary-500" />
                  Choose mobile brand
                </label>
                <select
                  className="mt-3 w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  value={selectedCompany?._id || ''}
                  onChange={(event) => {
                    const company = companies.find((item) => item._id === event.target.value) || null;
                    setSelectedCompany(company);
                  }}
                  disabled={loadingCompanies}
                >
                  <option value="">{loadingCompanies ? 'Loading companies...' : 'Select your device brand'}</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>{company.name}</option>
                  ))}
                </select>
              </div>

              <div>
                {/* <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Step 5</p> */}
                <label className="mt-2 block text-lg font-semibold text-gray-900">Choose mobile model</label>
                <select
                  className="mt-3 w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  value={selectedModel?._id || ''}
                  onChange={(event) => {
                    const model = models.find((item) => item._id === event.target.value) || null;
                    setSelectedModel(model);
                  }}
                  disabled={!selectedCompany || loadingModels}
                >
                  <option value="">
                    {!selectedCompany ? 'Select a brand first' : loadingModels ? 'Loading models...' : models.length ? 'Pick your model' : 'No models for this brand'}
                  </option>
                  {models.map((model) => (
                    <option key={model._id} value={model._id}>{model.name}</option>
                  ))}
                </select>
              </div>

              {catalogError && (
                <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">{catalogError}</p>
              )}

              <div className="pt-4 border-t border-dashed border-gray-200 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Pricing</p>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-3xl font-semibold text-gray-900">{formatPrice(COLLECTION_CASE_PRICE)}</span>
                    <span className="text-sm text-gray-500"></span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleCartAction('cart')}
                    disabled={!builderReady}
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition ${builderReady ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  >
                    <FiShoppingBag />
                    Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCartAction('buy')}
                    disabled={!builderReady}
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold border transition ${builderReady ? 'border-primary-600 text-primary-600 hover:bg-primary-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    Buy now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryImagePage;
