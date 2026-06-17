import { useEffect, useState } from "react"

export function useDebounce(query:string,delay:Number){
    const [debounceSearch,setDebounceSearch] = useState<string>("");

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setDebounceSearch(query);
        },delay as number);
        return ()=>clearTimeout(timer);
    },[query]);
    
    return debounceSearch;
}