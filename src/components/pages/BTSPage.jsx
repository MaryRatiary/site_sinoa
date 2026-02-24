import GroupProductPage from './GroupProductPage'
import btsProducts from '../../data/btsProducts'

export default function BTSPage() {
  return (
    <GroupProductPage 
      products={btsProducts}
      groupName="BTS – Bangtan Boys"
      groupDescription="Vêtements & Accessoires KPOP"
    />
  )
}