import { TodoSnapshotIn } from './Todo'
const presetList: TodoSnapshotIn[] = [
  /* 예약 */
  {
    id: '1',
    title: '숙박 예약',
    iconId: '🛌',
    type: 'flight',
  },
  /* 해외여행 */
  {
    id: '6',
    title: '여권',
    iconId: '여권',
    note: '미리미리 할 것',
    type: 'passport',
    category: 'foreign',
  },
  {
    id: '3',
    title: '환전',
    iconId: '💱',
    note: '미리미리 할 것',
    type: 'currency',
    category: 'foreign',
  },
  {
    id: '4',
    title: '로밍',
    iconId: '📶',
    note: '미리미리 할 것',
    type: 'roaming',
    category: 'foreign',
  },
  {
    id: '5',
    title: 'Visit Japan',
    iconId: '📝',
    note: '미리미리 할 것',
    type: 'visit-japan',
    category: 'foreign',
  },
  {
    id: '7',
    title: '국외여행허가',
    iconId: '🛌',
    type: 'military-approvement',
  },
  /* 해외여행 */
  {
    id: '8',
    title: '세면도구',
    iconId: '🧴',
    type: 'goods',
  },
  {
    id: '9',
    title: '어댑터',
    iconId: '🔌',
    type: 'goods',
  },
  {
    id: '10',
    title: '선글라스',
    iconId: '🕶',
    type: 'goods',
  },
  {
    id: '11',
    title: '캐리어',
    iconId: '🧳',
    type: 'goods',
  },
  {
    id: '12',
    title: '우산',
    iconId: '☂️',
    type: 'goods',
  },
]
export const CHECKLISTITEM_PRESET = Object.fromEntries(
  presetList.map(item => [item.id, item]),
)
