import { useOutletContext } from "react-router-dom";

export function usePageState() {
    return useOutletContext();
}