import "./globals.css";
import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
// import { Baloo_2 } from "next/font/google";
import React from "react";

// const poppins = Poppins({
// 	subsets: ["latin"],
// 	weight: ["400", "700", "900"],
// 	variable: "--font-poppins",
// 	display: "swap",
// });

// const baloo = Baloo_2({
// 	subsets: ["latin"],
// 	weight: ["400"],
// 	variable: "--font-baloo",
// 	display: "swap",
// });

export const metadata: Metadata = {
	title: "🌸",
	description: "dora's intro",
	openGraph: {
		siteName: "🌸",
		title: "🌸",
		description: "dora's intro",
		images: [
			{
				url: "https://dasunnydora.art/assets/images/card.jpg?v=ef1f2591",
				width: 1280,
				height: 800,
				alt: "🌸",
				type: "image/jpeg",
			},
		],
		url: "https://dasunnydora.art",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<meta name="color-scheme" content="light only" />
				<link rel="canonical" href="https://dasunnydora.art" />
			</head>
			<body>{children}</body>
		</html>
	);
}
