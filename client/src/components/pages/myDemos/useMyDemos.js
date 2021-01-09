const { default: Axios } = require("axios");
const { useEffect, useState } = require("react");

export const useMyDemos = () => {

    const [demos, setDemos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        
        let token = localStorage.getItem("auth-token");
        let loadingTimeout;

        setLoading(true);
  
        Axios.get("/demos/get-demo-list", { headers: { "x-auth-token": token } })
        .then(res => {
            loadingTimeout = setTimeout(() => {
                setDemos(res.data);
                setLoading(false);
                setError(null);
            }, 100);
        })
        .catch(err => {
            setError(err.message);
            setDemos(null);
            setLoading(false);
        })

        return () => clearTimeout(loadingTimeout);
     
    }, []);

    return { demos, loading, error, setError };
}