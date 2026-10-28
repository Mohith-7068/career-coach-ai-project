import { useCallback, useEffect, useState } from "react";
import { loadState } from "@/lib/careerState";

export default function useCareerState() {
    const [state, setState] = useState(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        const s = await loadState();
        setState(s);
        setLoading(false);
        return s;
    }, []);

    useEffect(() => {
        refresh();

        const handleUpdate = (e) => {
            if (e.detail) {
                setState(e.detail);
                setLoading(false);
            } else {
                refresh();
            }
        };

        const handleStorage = (e) => {
            if (e.key && e.key.includes("cc_career_state")) {
                refresh();
            }
        };

        window.addEventListener("career-state-updated", handleUpdate);
        window.addEventListener("storage", handleStorage);
        return () => {
            window.removeEventListener("career-state-updated", handleUpdate);
            window.removeEventListener("storage", handleStorage);
        };
    }, [refresh]);

    return { state, setState, loading, refresh };
}