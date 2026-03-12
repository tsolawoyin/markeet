import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "src/app/icon.svg");
const outDir = join(root, "public/icons");

mkdirSync(outDir, { recursive: true });

const svg = readFileSync(svgPath);

// All sizes needed for PWA manifest + Apple + general use
const sizes = [16, 20, 29, 32, 40, 48, 50, 57, 58, 60, 64, 72, 76, 80, 87,
  96, 100, 114, 120, 128, 144, 152, 167, 180, 192, 256, 512, 1024];

// Maskable icons (with extra padding for safe zone)
const maskableSizes = [48, 72, 96, 144, 192, 512];

async function generate() {
  // Generate standard icons
  for (const size of sizes) {
    await sharp(svg).resize(size, size).png().toFile(join(outDir, `${size}.png`));
    console.log(`Generated ${size}.png`);
  }

  // Generate maskable icons (with 20% safe zone padding on orange background)
  for (const size of maskableSizes) {
    const padding = Math.round(size * 0.1);
    const innerSize = size - padding * 2;

    const inner = await sharp(svg).resize(innerSize, innerSize).png().toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 234, g: 88, b: 12, alpha: 1 }, // orange-600
      },
    })
      .composite([{ input: inner, left: padding, top: padding }])
      .png()
      .toFile(join(outDir, `android-launchericon-${size}-${size}.png`));

    console.log(`Generated android-launchericon-${size}-${size}.png`);
  }

  // Generate Windows tile icons
  const tiles = [
    { name: "SmallTile", scales: { 100: 71, 125: 89, 150: 107, 200: 142, 400: 284 } },
    { name: "Square150x150Logo", scales: { 100: 150, 125: 188, 150: 225, 200: 300, 400: 600 } },
    { name: "LargeTile", scales: { 100: 310, 125: 388, 150: 465, 200: 620, 400: 1240 } },
    { name: "Square44x44Logo", scales: { 100: 44, 125: 55, 150: 66, 200: 88, 400: 176 } },
    { name: "StoreLogo", scales: { 100: 50, 125: 63, 150: 75, 200: 100, 400: 200 } },
  ];

  for (const tile of tiles) {
    for (const [scale, size] of Object.entries(tile.scales)) {
      await sharp(svg).resize(size, size).png().toFile(join(outDir, `${tile.name}.scale-${scale}.png`));
      console.log(`Generated ${tile.name}.scale-${scale}.png`);
    }
  }

  // Square44x44Logo targetsize variants
  const targetSizes = [16, 20, 24, 30, 32, 36, 40, 44, 48, 60, 64, 72, 80, 96, 256];
  for (const size of targetSizes) {
    for (const variant of ["targetsize", "altform-unplated_targetsize", "altform-lightunplated_targetsize"]) {
      await sharp(svg).resize(size, size).png().toFile(join(outDir, `Square44x44Logo.${variant}-${size}.png`));
    }
    console.log(`Generated Square44x44Logo targets for ${size}`);
  }

  // Splash screens (620x300)
  const splashScales = { 100: [620, 300], 125: [775, 375], 150: [930, 450], 200: [1240, 600], 400: [2480, 1200] };
  for (const [scale, [w, h]] of Object.entries(splashScales)) {
    const iconSize = Math.round(Math.min(w, h) * 0.5);
    const icon = await sharp(svg).resize(iconSize, iconSize).png().toBuffer();

    await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: { r: 234, g: 88, b: 12, alpha: 1 },
      },
    })
      .composite([{
        input: icon,
        left: Math.round((w - iconSize) / 2),
        top: Math.round((h - iconSize) / 2),
      }])
      .png()
      .toFile(join(outDir, `SplashScreen.scale-${scale}.png`));

    console.log(`Generated SplashScreen.scale-${scale}.png`);
  }

  console.log("\nAll icons generated successfully!");
}

generate().catch(console.error);
