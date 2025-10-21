import { useEffect, useState } from 'react'

export const useDelayedEdit = ({
    initialState = false,
    displayDelay = 500,
    //   isComplete,
    setComplete,
}: {
    initialState?: boolean
    displayDelay?: number
    //   isComplete: boolean
    setComplete: (isComplete: boolean) => void
}) => {
    const [displayComplete, setDisplayComplete] = useState(initialState)

    useEffect(() => {
        {
            const sleep = new Promise(resolve =>
                setTimeout(resolve, displayDelay),
            )
            sleep.then(() => {
                if (displayComplete) setComplete(true)
                else setComplete(false)
            })
        }
    }, [displayComplete, displayDelay])

    return { displayComplete, setDisplayComplete }
}
