import React, { useState, useEffect } from "react";
import { Icon } from "@neos-project/react-ui-components";
import { neos } from "@neos-project/neos-ui-decorators";
import style from "./style.module.css";

function Loading({ id, isLoading = false, delayTime = 500, timeoutTime = 5000, i18nRegistry }) {
    const [showLoading, setShowLoading] = useState(0);
    const title = i18nRegistry.translate("Neos.Neos:Main:loading");

    useEffect(() => {
        if (!isLoading) {
            setShowLoading(0);
            return;
        }
        const delay = setTimeout(() => {
            setShowLoading(1);
        }, delayTime);
        const timeout = setTimeout(() => {
            setShowLoading(2);
        }, delayTime + timeoutTime);

        return () => {
            clearTimeout(delay);
            clearTimeout(timeout);
        };
    }, [isLoading]);

    if (!isLoading) {
        return null;
    }

    return (
        <div id={id} className={style.loading} title={`${title}…`}>
            <svg
                width="30"
                height="30"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className={showLoading == 1 ? style.loadingActive : null}
            >
                <g>
                    <circle cx="12" cy="12" r="9.5" fill="none" stroke-width="2" stroke-linecap="round">
                        <Animate attributeName="stroke-dasharray" values="0 150;42 150;42 150;42 150" />
                        <Animate attributeName="stroke-dashoffset" values="0;-16;-59;-59" />
                    </circle>
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        dur="2s"
                        values="0 12 12;360 12 12"
                        repeatCount="indefinite"
                    />
                </g>
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                className={showLoading == 2 ? style.loadingActive : null}
            >
                <Circle number={3} />
                <Circle number={2} />
                <Circle number={1} />
            </svg>
        </div>
    );
}

function Circle({ number }) {
    const cx = number * 6;
    const beginn = Math.round((100 / 3) * (number - 1)) / 100;

    return (
        <circle cx={cx} cy="12" r="0" fill="currentColor">
            <animate
                attributeName="r"
                begin={beginn}
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
            ></animate>
        </circle>
    );
}

function Animate({ duration, attributeName, values }) {
    return (
        <animate
            attributeName={attributeName}
            dur="1.5s"
            calcMode="spline"
            values={values}
            keyTimes="0;0.475;0.95;1"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
            repeatCount="indefinite"
        />
    );
}

const neosifier = neos((globalRegistry) => ({
    i18nRegistry: globalRegistry.get("i18n"),
}));
export default neosifier(Loading);

// <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle></svg>
