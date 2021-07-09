import {
    createElement,
    Fragment,
    FunctionComponent,
    ReactNode,
    FunctionComponentElement,
    VoidFunctionComponent
} from "react";

interface CreateGhost {
<P>(ghost: FunctionComponent<P>, props?: P, ...children: ReactNode[]): FunctionComponentElement<P>;
}
interface CreateGhosts {
    (...children: ReactNode[]): FunctionComponentElement<{ children?: ReactNode }>;
}

export type Ghost<P = unknown> = VoidFunctionComponent<P>;

export const ghost: CreateGhost = createElement;

export const ghosts: CreateGhosts = (...children) => createElement(Fragment, null, ...children);
