import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { vi } from 'vitest';
import type { ComponentProps, ElementType, ForwardedRef } from 'react';

// Create motion components first
const motionComponents = {
  div: React.forwardRef((props: ComponentProps<'div'>, ref: ForwardedRef<HTMLDivElement>) => (
    <div ref={ref} {...props} />
  )),
  button: React.forwardRef((props: ComponentProps<'button'>, ref: ForwardedRef<HTMLButtonElement>) => (
    <button ref={ref} {...props} />
  )),
  span: React.forwardRef((props: ComponentProps<'span'>, ref: ForwardedRef<HTMLSpanElement>) => (
    <span ref={ref} {...props} />
  )),
  p: React.forwardRef((props: ComponentProps<'p'>, ref: ForwardedRef<HTMLParagraphElement>) => (
    <p ref={ref} {...props} />
  )),
  h1: React.forwardRef((props: ComponentProps<'h1'>, ref: ForwardedRef<HTMLHeadingElement>) => (
    <h1 ref={ref} {...props} />
  )),
  h2: React.forwardRef((props: ComponentProps<'h2'>, ref: ForwardedRef<HTMLHeadingElement>) => (
    <h2 ref={ref} {...props} />
  )),
  h3: React.forwardRef((props: ComponentProps<'h3'>, ref: ForwardedRef<HTMLHeadingElement>) => (
    <h3 ref={ref} {...props} />
  )),
  h4: React.forwardRef((props: ComponentProps<'h4'>, ref: ForwardedRef<HTMLHeadingElement>) => (
    <h4 ref={ref} {...props} />
  )),
  h5: React.forwardRef((props: ComponentProps<'h5'>, ref: ForwardedRef<HTMLHeadingElement>) => (
    <h5 ref={ref} {...props} />
  )),
  h6: React.forwardRef((props: ComponentProps<'h6'>, ref: ForwardedRef<HTMLHeadingElement>) => (
    <h6 ref={ref} {...props} />
  )),
  ul: React.forwardRef((props: ComponentProps<'ul'>, ref: ForwardedRef<HTMLUListElement>) => (
    <ul ref={ref} {...props} />
  )),
  ol: React.forwardRef((props: ComponentProps<'ol'>, ref: ForwardedRef<HTMLOListElement>) => (
    <ol ref={ref} {...props} />
  )),
  li: React.forwardRef((props: ComponentProps<'li'>, ref: ForwardedRef<HTMLLIElement>) => (
    <li ref={ref} {...props} />
  )),
  a: React.forwardRef((props: ComponentProps<'a'>, ref: ForwardedRef<HTMLAnchorElement>) => (
    <a ref={ref} {...props} />
  )),
  img: React.forwardRef((props: ComponentProps<'img'>, ref: ForwardedRef<HTMLImageElement>) => (
    <img ref={ref} {...props} />
  )),
  input: React.forwardRef((props: ComponentProps<'input'>, ref: ForwardedRef<HTMLInputElement>) => (
    <input ref={ref} {...props} />
  )),
  label: React.forwardRef((props: ComponentProps<'label'>, ref: ForwardedRef<HTMLLabelElement>) => (
    <label ref={ref} {...props} />
  )),
  select: React.forwardRef((props: ComponentProps<'select'>, ref: ForwardedRef<HTMLSelectElement>) => (
    <select ref={ref} {...props} />
  )),
  textarea: React.forwardRef((props: ComponentProps<'textarea'>, ref: ForwardedRef<HTMLTextAreaElement>) => (
    <textarea ref={ref} {...props} />
  )),
  form: React.forwardRef((props: ComponentProps<'form'>, ref: ForwardedRef<HTMLFormElement>) => (
    <form ref={ref} {...props} />
  )),
  nav: React.forwardRef((props: ComponentProps<'nav'>, ref: ForwardedRef<HTMLElement>) => (
    <nav ref={ref} {...props} />
  )),
  header: React.forwardRef((props: ComponentProps<'header'>, ref: ForwardedRef<HTMLElement>) => (
    <header ref={ref} {...props} />
  )),
  footer: React.forwardRef((props: ComponentProps<'footer'>, ref: ForwardedRef<HTMLElement>) => (
    <footer ref={ref} {...props} />
  )),
  main: React.forwardRef((props: ComponentProps<'main'>, ref: ForwardedRef<HTMLElement>) => (
    <main ref={ref} {...props} />
  )),
  section: React.forwardRef((props: ComponentProps<'section'>, ref: ForwardedRef<HTMLElement>) => (
    <section ref={ref} {...props} />
  )),
  article: React.forwardRef((props: ComponentProps<'article'>, ref: ForwardedRef<HTMLElement>) => (
    <article ref={ref} {...props} />
  )),
  aside: React.forwardRef((props: ComponentProps<'aside'>, ref: ForwardedRef<HTMLElement>) => (
    <aside ref={ref} {...props} />
  )),
  table: React.forwardRef((props: ComponentProps<'table'>, ref: ForwardedRef<HTMLTableElement>) => (
    <table ref={ref} {...props} />
  )),
  thead: React.forwardRef((props: ComponentProps<'thead'>, ref: ForwardedRef<HTMLTableSectionElement>) => (
    <thead ref={ref} {...props} />
  )),
  tbody: React.forwardRef((props: ComponentProps<'tbody'>, ref: ForwardedRef<HTMLTableSectionElement>) => (
    <tbody ref={ref} {...props} />
  )),
  tr: React.forwardRef((props: ComponentProps<'tr'>, ref: ForwardedRef<HTMLTableRowElement>) => (
    <tr ref={ref} {...props} />
  )),
  th: React.forwardRef((props: ComponentProps<'th'>, ref: ForwardedRef<HTMLTableCellElement>) => (
    <th ref={ref} {...props} />
  )),
  td: React.forwardRef((props: ComponentProps<'td'>, ref: ForwardedRef<HTMLTableCellElement>) => (
    <td ref={ref} {...props} />
  )),
  canvas: React.forwardRef((props: ComponentProps<'canvas'>, ref: ForwardedRef<HTMLCanvasElement>) => (
    <canvas ref={ref} {...props} />
  )),
  video: React.forwardRef((props: ComponentProps<'video'>, ref: ForwardedRef<HTMLVideoElement>) => (
    <video ref={ref} {...props} />
  )),
  audio: React.forwardRef((props: ComponentProps<'audio'>, ref: ForwardedRef<HTMLAudioElement>) => (
    <audio ref={ref} {...props} />
  )),
  iframe: React.forwardRef((props: ComponentProps<'iframe'>, ref: ForwardedRef<HTMLIFrameElement>) => (
    <iframe ref={ref} {...props} />
  )),
  object: React.forwardRef((props: ComponentProps<'object'>, ref: ForwardedRef<HTMLObjectElement>) => (
    <object ref={ref} {...props} />
  )),
  embed: React.forwardRef((props: ComponentProps<'embed'>, ref: ForwardedRef<HTMLEmbedElement>) => (
    <embed ref={ref} {...props} />
  )),
  param: React.forwardRef((props: ComponentProps<'param'>, ref: ForwardedRef<HTMLParamElement>) => (
    <param ref={ref} {...props} />
  )),
  source: React.forwardRef((props: ComponentProps<'source'>, ref: ForwardedRef<HTMLSourceElement>) => (
    <source ref={ref} {...props} />
  )),
  track: React.forwardRef((props: ComponentProps<'track'>, ref: ForwardedRef<HTMLTrackElement>) => (
    <track ref={ref} {...props} />
  )),
  wbr: React.forwardRef((props: ComponentProps<'wbr'>, ref: ForwardedRef<HTMLElement>) => (
    <wbr ref={ref} {...props} />
  )),
  bdi: React.forwardRef((props: ComponentProps<'bdi'>, ref: ForwardedRef<HTMLElement>) => (
    <bdi ref={ref} {...props} />
  )),
  bdo: React.forwardRef((props: ComponentProps<'bdo'>, ref: ForwardedRef<HTMLElement>) => (
    <bdo ref={ref} {...props} />
  )),
  br: React.forwardRef((props: ComponentProps<'br'>, ref: ForwardedRef<HTMLBRElement>) => (
    <br ref={ref} {...props} />
  )),
  cite: React.forwardRef((props: ComponentProps<'cite'>, ref: ForwardedRef<HTMLElement>) => (
    <cite ref={ref} {...props} />
  )),
  code: React.forwardRef((props: ComponentProps<'code'>, ref: ForwardedRef<HTMLElement>) => (
    <code ref={ref} {...props} />
  )),
  dfn: React.forwardRef((props: ComponentProps<'dfn'>, ref: ForwardedRef<HTMLElement>) => (
    <dfn ref={ref} {...props} />
  )),
  em: React.forwardRef((props: ComponentProps<'em'>, ref: ForwardedRef<HTMLElement>) => (
    <em ref={ref} {...props} />
  )),
  i: React.forwardRef((props: ComponentProps<'i'>, ref: ForwardedRef<HTMLElement>) => (
    <i ref={ref} {...props} />
  )),
  kbd: React.forwardRef((props: ComponentProps<'kbd'>, ref: ForwardedRef<HTMLElement>) => (
    <kbd ref={ref} {...props} />
  )),
  mark: React.forwardRef((props: ComponentProps<'mark'>, ref: ForwardedRef<HTMLElement>) => (
    <mark ref={ref} {...props} />
  )),
  q: React.forwardRef((props: ComponentProps<'q'>, ref: ForwardedRef<HTMLQuoteElement>) => (
    <q ref={ref} {...props} />
  )),
  rp: React.forwardRef((props: ComponentProps<'rp'>, ref: ForwardedRef<HTMLElement>) => (
    <rp ref={ref} {...props} />
  )),
  rt: React.forwardRef((props: ComponentProps<'rt'>, ref: ForwardedRef<HTMLElement>) => (
    <rt ref={ref} {...props} />
  )),
  ruby: React.forwardRef((props: ComponentProps<'ruby'>, ref: ForwardedRef<HTMLElement>) => (
    <ruby ref={ref} {...props} />
  )),
  s: React.forwardRef((props: ComponentProps<'s'>, ref: ForwardedRef<HTMLElement>) => (
    <s ref={ref} {...props} />
  )),
  samp: React.forwardRef((props: ComponentProps<'samp'>, ref: ForwardedRef<HTMLElement>) => (
    <samp ref={ref} {...props} />
  )),
  small: React.forwardRef((props: ComponentProps<'small'>, ref: ForwardedRef<HTMLElement>) => (
    <small ref={ref} {...props} />
  )),
  strong: React.forwardRef((props: ComponentProps<'strong'>, ref: ForwardedRef<HTMLElement>) => (
    <strong ref={ref} {...props} />
  )),
  sub: React.forwardRef((props: ComponentProps<'sub'>, ref: ForwardedRef<HTMLElement>) => (
    <sub ref={ref} {...props} />
  )),
  sup: React.forwardRef((props: ComponentProps<'sup'>, ref: ForwardedRef<HTMLElement>) => (
    <sup ref={ref} {...props} />
  )),
  u: React.forwardRef((props: ComponentProps<'u'>, ref: ForwardedRef<HTMLElement>) => (
    <u ref={ref} {...props} />
  )),
  var: React.forwardRef((props: ComponentProps<'var'>, ref: ForwardedRef<HTMLElement>) => (
    <var ref={ref} {...props} />
  )),
};

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: motionComponents,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn()
  }),
  useMotionValue: (initial: any) => ({
    get: () => initial,
    set: vi.fn(),
    onChange: vi.fn()
  }),
  useTransform: () => ({
    get: vi.fn(),
    set: vi.fn()
  })
}));

// Define interfaces for typed styled components
interface StyledFunction {
  (styles: any): React.ForwardRefExoticComponent<React.PropsWithRef<any>>;
  attrs: (attrs: Record<string, any>) => (styles: any) => React.ForwardRefExoticComponent<React.PropsWithRef<any>>;
}

// Define the function to create styled components
function createStyledComponent(Component: React.ComponentType<any> | string): StyledFunction {
  const StyledComponent = React.forwardRef((props: any, ref: React.Ref<any>) => {
    if (typeof Component === 'string') {
      return React.createElement(Component, { ref, ...props });
    }
    return <Component ref={ref} {...props} />;
  });
  
  StyledComponent.displayName = 'StyledComponent';
  
  // Create the base function
  const baseFunction = (styles: any) => StyledComponent;
  
  // Add the attrs method
  (baseFunction as StyledFunction).attrs = createStyledWithAttrs(Component);
  
  return baseFunction as StyledFunction;
}

// Define a function to create the attrs functionality
function createStyledWithAttrs(Component: React.ComponentType<any> | string) {
  return (attrs: Record<string, any>) => {
    const StyledWithAttrs = React.forwardRef((props: any, ref: React.Ref<any>) => {
      if (typeof Component === 'string') {
        return React.createElement(Component, { ref, ...attrs, ...props });
      }
      return <Component ref={ref} {...attrs} {...props} />;
    });
    
    StyledWithAttrs.displayName = 'StyledComponentWithAttrs';
    
    return (styles: any) => StyledWithAttrs;
  };
}

// Mock styled-components
vi.mock('styled-components', () => {
  // Create the base styled function
  const styledFunction = (Component: any) => {
    // Handle motion components specifically
    if (Component && Component === motionComponents.button) {
      return createStyledComponent('button');
    }
    if (Component && Component === motionComponents.div) {
      return createStyledComponent('div');
    }
    if (Component && typeof Component === 'object') {
      // For any other motion component or styled component
      return createStyledComponent('div');
    }
    
    // For regular components
    return createStyledComponent(Component || 'div');
  };
  
  // Build the styled object
  const styled: Record<string, StyledFunction> = {};
  
  // Add all HTML elements with appropriate attrs support
  ['div', 'button', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
   'ul', 'ol', 'li', 'a', 'img', 'input', 'label', 'select', 'textarea', 
   'form', 'nav', 'header', 'footer', 'main', 'section', 'article', 'aside',
   'table', 'thead', 'tbody', 'tr', 'th', 'td'].forEach(tag => {
    styled[tag] = createStyledComponent(tag);
  });
  
  // Copy all properties from styled to styledFunction
  Object.assign(styledFunction, styled);
  
  return {
    default: styledFunction,
    createGlobalStyle: () => () => null,
    css: () => '',
    keyframes: () => '',
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
  };
});

// Create a custom render function
function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { ...options });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render }; 