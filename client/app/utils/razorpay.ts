const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise: Promise<boolean> | undefined;

export const loadRazorpay = (): Promise<boolean> => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }
  if (window.Razorpay) {
    return Promise.resolve(true);
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT}"]`
    );
    const script = existing || document.createElement("script");

    const finish = () => resolve(Boolean(window.Razorpay));
    const fail = () => {
      loadPromise = undefined;
      resolve(false);
    };

    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", fail, { once: true });
    if (!existing) {
      script.src = RAZORPAY_SCRIPT;
      document.body.appendChild(script);
    }
  });

  return loadPromise;
};
