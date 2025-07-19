import { useState, useEffect } from "react";

const useApi = (apiFunc, params) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let isMounted = true;
		setLoading(true);
		apiFunc(params)
			.then((response) => {
				if (isMounted) setData(response);
			})
			.catch((err) => {
				if (isMounted) setError(err);
			})
			.finally(() => {
				if (isMounted) setLoading(false);
			});
		return () => {
			isMounted = false;
		};
	}, [apiFunc, params]);

	return { data, loading, error };
};

export default useApi;
