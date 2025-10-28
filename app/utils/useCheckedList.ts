import { useCallback, useState } from 'react'

export const useCheckedList = (list: any[]) => {
    const [checkedlist, setCheckedList] = useState<{ [key: string]: boolean }>(
        Object.fromEntries(list.map(id => [id, false])),
    )

    const handlePress = useCallback((reservationId: string) => {
        setCheckedList(prev => ({
            ...prev,
            [reservationId]: !prev[reservationId],
        }))
    }, [])

    return {
        checkedlist,
        setCheckedList,
        handlePress,
        numOfCheckedItem: Object.values(checkedlist).filter(
            isChecked => isChecked,
        ).length,
    }
}
