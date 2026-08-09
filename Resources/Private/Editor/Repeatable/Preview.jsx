import React, { useEffect, useState } from "react";
import clsx from "clsx";
import backend from "@neos-project/neos-ui-backend-connector";
import style from "./style.module.css";

let loadImageMetadata = null;

export default function Preview({ text, image, backgroundColor }) {
    const [src, setSrc] = useState();
    const [thumbnailStyles, setThumbnailStyles] = useState({});
    const [cropAreaStyles, setCropAreaStyles] = useState({});

    useEffect(() => {
        if (!image) {
            return;
        }

        if (typeof image === "string") {
            setSrc(image);
            return;
        }

        if (!image?.__identity) {
            return;
        }

        const fn = async () => {
            if (!loadImageMetadata) {
                loadImageMetadata = await backend.get().endpoints.loadImageMetadata;
            }
            const metadata = await loadImageMetadata(image?.__identity);

            if (metadata?.previewImageResourceUri) {
                const adjustments =
                    metadata?.object?.adjustments?.["Neos\\Media\\Domain\\Model\\Adjustment\\CropImageAdjustment"] ||
                    null;
                const { thumbnail, cropArea } = getStyles(
                    metadata?.previewDimensions,
                    metadata?.originalDimensions,
                    adjustments,
                );
                setThumbnailStyles(thumbnail);
                setCropAreaStyles(cropArea);
                setSrc(metadata.previewImageResourceUri);
            }
        };
        fn();
    }, [image]);

    const cleanText = cleanHtml(text || "");
    const cleanBackgroundColor = cleanHtml(backgroundColor || null);

    if (src) {
        return (
            <div className={style.preview} style={{ backgroundColor: cleanBackgroundColor }}>
                <figure style={cropAreaStyles}>
                    <img src={src} style={thumbnailStyles} title={cleanText} />
                </figure>
            </div>
        );
    }

    if (cleanText) {
        return (
            <span
                className={clsx(style.label, cleanBackgroundColor && style.backgroundColor)}
                style={{ backgroundColor: cleanBackgroundColor }}
            >
                {cleanText}
            </span>
        );
    }

    if (cleanBackgroundColor) {
        return (
            <span className={style.label} style={{ backgroundColor: cleanBackgroundColor }}>
                &nbsp;
            </span>
        );
    }

    return null;
}

function cleanHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

function getStyles(previewDimensions, originalDimensions, adjustments) {
    const max = {
        height: 40,
        width: 129,
    };

    const previewAdjustments = (() => {
        if (!adjustments?.height) {
            return null;
        }
        const factor = originalDimensions.height / previewDimensions.height;
        return {
            height: adjustments.height / factor,
            width: adjustments?.width / factor,
            x: adjustments?.x / factor,
            y: adjustments?.y / factor,
        };
    })();

    const scalingFactor = (() => {
        const byHeight = max.height / (previewAdjustments?.height || previewDimensions.height);
        const byWidth = max.width / (previewAdjustments?.width || previewDimensions.width);
        return Math.min(byHeight, byWidth);
    })();

    const dimensions = {
        width: previewDimensions.width * scalingFactor,
        height: previewDimensions.height * scalingFactor,
    };

    const cropDimensions = {
        width: (previewAdjustments?.width || previewDimensions.width) * scalingFactor,
        height: (previewAdjustments?.height || previewDimensions.height) * scalingFactor,
    };

    const x = previewAdjustments?.x || 0;
    const y = previewAdjustments?.y || 0;

    return {
        thumbnail: {
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            left: `-${x * scalingFactor}px`,
            top: `-${y * scalingFactor}px`,
        },
        cropArea: {
            width: `${cropDimensions.width}px`,
            height: `${cropDimensions.height}px`,
        },
    };
}
