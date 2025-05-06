export function mockIntersectionObserver() {
  class IntersectionObserver {
    root = null;
    rootMargin = "";
    thresholds = [];

    disconnect() {
      return null;
    }

    observe() {
      return null;
    }

    takeRecords() {
      return [];
    }

    unobserve() {
      return null;
    }
  }
  window.IntersectionObserver = IntersectionObserver;
  global.IntersectionObserver = IntersectionObserver;
}

export function mockResizeObserver() {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;
  global.ResizeObserver = ResizeObserver;
}
