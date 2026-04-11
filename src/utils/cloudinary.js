/**
 * Utility to manage Cloudinary image optimization and transformations.
 */

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dl16kpngy/image/upload/";

/**
 * Appends optimization parameters to a Cloudinary URL.
 * @param {string} url - Original Cloudinary URL or filename from mapping
 * @param {string} transformations - Custom transformations (e.g., 'w_500,h_500')
 * @returns {string} - Optimized URL
 */
export const getOptimizedUrl = (url, transformations = "") => {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  // Added f_auto (format auto), q_auto (quality auto) for lightweight delivery
  const defaultParams = "f_auto,q_auto";
  const finalTransformations = transformations 
    ? `${defaultParams},${transformations}` 
    : defaultParams;

  return `${parts[0]}/upload/${finalTransformations}/${parts[1]}`;
};

/**
 * Mapping of local filenames to Cloudinary secure URLs.
 * Generated via migration script.
 */
export const CLOUDINARY_ASSETS = {
  "award1.jpg": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900102/static_assets/award1.jpg",
  "award2.jpg": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900103/static_assets/award2.jpg",
  "building.jpg.png": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900105/static_assets/building.jpg.png",
  "cat_marketing.png.jpg": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900106/static_assets/cat_marketing.png.png",
  "cat_mern.png.png": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900107/static_assets/cat_mern.png.png",
  "cat_uiux.png.png": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900110/static_assets/cat_uiux.png.png",
  "ceo.png": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900112/static_assets/ceo.png",
  "desun-logo.png": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900113/static_assets/desun-logo.png",
  "partner-logos.png": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900114/static_assets/partner-logos.png",
  "slide3.jpg": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900115/static_assets/slide3.jpg",
  "slide4.jpg": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900116/static_assets/slide4.jpg",
  "slide5.jpg": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900117/static_assets/slide5.jpg",
  "slide6.jpg": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900118/static_assets/slide6.jpg",
  "slide7.jpg": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900119/static_assets/slide7.jpg",
  "slide8.jpg": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900120/static_assets/slide8.jpg",
  "slide9.jpg": "https://res.cloudinary.com/dl16kpngy/image/upload/v1775900121/static_assets/slide9.jpg"
};
