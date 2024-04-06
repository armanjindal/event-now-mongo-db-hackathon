"use client"
import { useState, useEffect, ChangeEvent, useCallback } from "react"
import debounce from "lodash.debounce"
// TODO: Convert this into a real supabase query

const getSearchResults = async (searchTerm: string) => {
  const test = `http://127.0.0.1:5000/data?${searchTerm}`
  fetch(test)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log(test)
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('There was a problem with your fetch operation:', error));
}

export default function SearchBar () {
  const [open, setOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] =  useState<string[]>([]);

  const request = debounce(async (searchTerm : string) => {
      const results = await getSearchResults(searchTerm)
      setSearchResults(results)
    },1000 //debounce time
  )

  const debouncedRequest = useCallback(
    (searchTerm: string)=> request(searchTerm), 
    []
  )


  //
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // constrolled input value 
    debouncedRequest(e.target.value)
  };

}