import { useStores, useUserStore } from '@/models'
import { getSnapshot } from 'mobx-state-tree'

export const useResourceQuota = () => {
    const userStore = useUserStore()
    const { resourceQuotaStore } = useStores()

    return {
        hasReachedTripNumberLimit:
            userStore.tripSummary.length >= resourceQuotaStore.maxTrips,
        hasReachedDestinationNumberLimit:
            !!userStore.activeTrip &&
            userStore.activeTrip?.destinations.length >=
                resourceQuotaStore.maxDestinations,
        hasReachedTodoNumberLimit:
            !!userStore.activeTrip &&
            userStore.activeTrip?.todos.length >= resourceQuotaStore.maxTodos,
        hasReachedReservationNumberLimit:
            !!userStore.activeTrip &&
            userStore.activeTrip?.reservationStore.reservationList.length >=
                resourceQuotaStore.maxReservations,
        ...getSnapshot(resourceQuotaStore),
    }
}
