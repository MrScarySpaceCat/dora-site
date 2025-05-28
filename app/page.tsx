"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Small wrapper to support className defaults in buttons
type ButtonProps = {
	href: string;
	onClick?: (e: React.MouseEvent) => void;
	className?: string;
	children: React.ReactNode;
	[key: string]: unknown;
};

function Button({ href, onClick, className, children, ...props }: ButtonProps) {
	return (
		<a
			href={href}
			className={className}
			role="button"
			onClick={onClick}
			{...props}
		>
			{children}
		</a>
	);
}

export default function HomePage() {
	const [active, setActive] = useState<"home" | "second">("home");

	useEffect(() => {
		const setSectionFromHash = () => {
			if (window.location.hash === "#second") setActive("second");
			else setActive("home");
		};
		window.addEventListener("hashchange", setSectionFromHash);
		setSectionFromHash();
		return () => window.removeEventListener("hashchange", setSectionFromHash);
	}, []);

	const goHome = (e: React.MouseEvent) => {
		e.preventDefault();
		window.location.hash = "#home";
		setActive("home");
	};
	const goSecond = (e: React.MouseEvent) => {
		e.preventDefault();
		window.location.hash = "#second";
		setActive("second");
	};

	return (
		<>
			<div id="wrapper">
				<main id="main">
					<div className="inner">
						<header id="header">
							<div id="container01" className="container columns">
								<div className="wrapper">
									<div className="inner">
										<div>
											<div id="image02" className="image">
												<span className="frame deferred">
													<Image
														src="/images/image02.jpg?v=ef1f2591"
														alt=""
														width={240}
														height={240}
														style={{ borderRadius: "100%" }}
													/>
												</span>
											</div>
										</div>
										<div>
											<ul id="buttons01" className="buttons">
												<li>
													<Button
														href="#home"
														className="button n01"
														onClick={goHome}
													>
														Home
													</Button>
												</li>
											</ul>
											<p id="text03">
												Hello everyone! im <strong>Dora</strong>, currently a
												minor (16).
												<em> Japanese</em>, <strong>timezone</strong> GMT +9.
												Trilingual <strong>૮ ˶ᵔ ᵕ ᵔ˶ ა</strong>
											</p>
										</div>
									</div>
								</div>
							</div>
							<ul id="buttons02" className="buttons">
								<li>
									<Button href="#home" className="button n01" onClick={goHome}>
										Home
									</Button>
								</li>
								<li>
									<Button
										href="#second"
										className="button n02"
										onClick={goSecond}
									>
										Art n Commission &lt;3
									</Button>
								</li>
							</ul>
						</header>

						<section
							id="home-section"
							style={{
								display: active === "home" ? "block" : "none",
								opacity: active === "home" ? 1 : 0,
								transition: "opacity 0.8s",
							}}
						>
							<div id="container04" className="container columns">
								<div className="wrapper">
									<div className="inner">
										<div>
											<h2 id="text07">Likes &amp; Dislikes</h2>
											<p id="text09">
												<span className="p">
													<strong>What I like</strong> cats, chocolate, Roblox,
													rhythm games, and words of kindness &gt;:3
													<br />
													<strong>What I dislike</strong> cruelty, overdoing
													offensive jokes and making too much of them, and
													toxicity.
												</span>
											</p>
										</div>
										<div>
											<div
												id="image03"
												className="image"
												data-position="center"
											>
												<span className="frame">
													<Image
														src="/images/image03.jpg?v=ef1f2591"
														alt=""
														width={180}
														height={148}
														style={{
															objectFit: "cover",
															objectPosition: "center",
														}}
													/>
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="container05" className="container columns">
								<div className="wrapper">
									<div className="inner">
										<div>
											<h2 id="text05">Before you Interact</h2>
											<p id="text10">
												I&apos;m a really sensitive person, so please watch the
												insults you say towards me, I can&apos;t tell sarcasm if
												tone tags aren&apos;t included.
											</p>
										</div>
										<div>
											<h2 id="text11">Don&apos;t Interact if</h2>
											<p id="text12">
												nothing idk I tolerate a lot of weird shit . . .
											</p>
										</div>
									</div>
								</div>
							</div>
						</section>

						<section
							id="second-section"
							style={{
								display: active === "second" ? "block" : "none",
								opacity: active === "second" ? 1 : 0,
								transition: "opacity 0.8s",
							}}
						>
							<div id="container02" className="container default">
								<div className="wrapper">
									<div className="inner">
										<h2 id="text01">Art Gallery</h2>
										<div id="gallery01" className="gallery">
											<div className="inner">
												<ul>
													<li>
														<span className="frame">
															<Image
																src="/images/gallery01/935f677b.jpg?v=ef1f2591"
																alt="Untitled"
																width={180}
																height={150}
															/>
														</span>
													</li>
													<li>
														<span className="frame">
															<Image
																src="/images/gallery01/fbb56c74.jpg?v=ef1f2591"
																alt="Untitled"
																width={180}
																height={150}
															/>
														</span>
													</li>
													<li>
														<span className="frame">
															<Image
																src="/images/gallery01/8ec8a936.jpg?v=ef1f2591"
																alt="Untitled"
																width={180}
																height={150}
															/>
														</span>
													</li>
													<li>
														<span className="frame">
															<Image
																src="/images/gallery01/92c6565f.jpg?v=ef1f2591"
																alt="Untitled"
																width={180}
																height={150}
															/>
														</span>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="container03" className="container columns">
								<div className="wrapper">
									<div className="inner">
										<div>
											<h2 id="text06">Commission</h2>
										</div>
										<div>
											<p id="text08">
												<em>note</em> Im doing art commissions for robux or
												discord nitro, if ur interested please dm&nbsp;
												<a href="https://discord.com/users/1224337224313864224">
													@dasunnydora
												</a>{" "}
												on discord
											</p>
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>
				</main>
			</div>
		</>
	);
}
