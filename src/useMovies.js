import { useState, useEffect } from "react"

const KEY = "f5ddaba"

export function useMovies(query) {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(
    function () {
      // callback?.()

      const controller = new AbortController()

      async function fetchMovies() {
        try {
          setIsLoading(true)
          setError("")
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          )

          if (!res.ok)
            throw new Error("Oops! Something went wrong while fetching movies")

          const data = await res.json()

          if (data.Response === "False") throw new Error("Movie not found")

          setMovies(data.Search)
          setError("")
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(error.message)
            setError(err.message)
          }
        } finally {
          setIsLoading(false)
        }
      }
      if (query.length < 3) {
        setMovies([])
        setError("")
        return
      }

      fetchMovies()

      return function () {
        controller.abort()
      }
    },
    [query, error.message]
  )

  return { movies, isLoading, error }
}
