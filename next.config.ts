// Next.js configuration with minimumCacheTTL for image optimization and bundle analyzer setup
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
	images: {
		minimumCacheTTL: 60, // cache optimized images for 60 seconds
	},
});
