import React from "react";
import { get } from "dot-prop-immutable";
import { ElementRoot } from "../../../components/ElementRoot";
import { PbElement } from "~/types";
import { PageBuilderContext } from "../../../../contexts/PageBuilder";

interface IFrameProps {
    element: PbElement;
}

const IFrame: React.FC<IFrameProps> = ({ element }) => {
    const { data } = element;
    const {
        responsiveDisplayMode: { displayMode }
    } = React.useContext(PageBuilderContext);

    const elementHeight = data?.settings?.height?.[displayMode]?.value || "initial";

    return (
        <ElementRoot
            element={element}
            className={"webiny-pb-base-page-element-style webiny-pb-page-element-iframe"}
        >
            <iframe
                style={{ height: elementHeight }}
                id={element.id}
                src={get(element, "data.iframe.url") || ""}
            />
        </ElementRoot>
    );
};

export default IFrame;
