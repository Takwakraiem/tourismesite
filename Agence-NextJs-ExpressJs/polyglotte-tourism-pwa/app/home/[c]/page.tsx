import HomeClient from "./HomeClient"

export default function HomePage({ params }: { params: { country: string } }) {
  return <HomeClient c={params.country} />
}
