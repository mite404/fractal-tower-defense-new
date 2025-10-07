import { useEffect, useRef } from "react";
import { Application, Assets, Container, Sprite } from "pixi.js";

export function SpriteExample() {
	const canvasRef = useRef<HTMLDivElement>(null);
	const appRef = useRef<Application | null>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		let mounted = true;
		let initialized = false;

		const setup = async () => {
			const app = new Application();
			appRef.current = app;

			try {
				await app.init({ background: 0x1099bb, resizeTo: window });
				if (!mounted || !canvasRef.current) return;

				initialized = true;

				canvasRef.current.appendChild(app.canvas);

				const container = new Container();
				app.stage.addChild(container);

				const bunnyTexture = await Assets.load(
					"/images/example_bunny.png"
				);
				const bunny = new Sprite(bunnyTexture);
				bunny.anchor.set(0.5);
				bunny.x = app.screen.width / 2;
				bunny.y = app.screen.height / 2;
				container.addChild(bunny);

				app.ticker.add((time) => {
					bunny.rotation += 0.05 * time.deltaTime;
				});
			} catch (err) {
				console.error("Pixi init failed:", err);
			}
		};

		setup();

		return () => {
			mounted = false;
			if (initialized && appRef.current) {
				appRef.current.destroy(true, { children: true });
				appRef.current = null;
			}
		};
	}, []);

	return <div ref={canvasRef} />;
}
