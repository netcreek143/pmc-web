export const fetcher = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Request failed');
    }
    return res.json();
};

export const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
