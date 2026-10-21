import { Link } from 'react-router-dom'
import { Container } from '../../components/Container'

export function Hero() {
  return (
    <section className="pb-6 pt-10 sm:pt-14">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-gold-deep shadow-card"><span className="h-2 w-2 rounded-full bg-gold" />Boards · Kitchen · Furniture accessories</span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">Quality Boards &amp; Accessories for Kitchens and Furniture.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">Browse the catalogue, build a list and request a wholesale or retail quotation. No account needed.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="btn-gold !min-h-[3rem] !px-7 text-base">Explore Products</Link>
            <Link to="/quote" className="btn-ghost !min-h-[3rem] !px-7 text-base">Request a Quote</Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-[5/4] w-full max-w-xl lg:max-w-none" aria-hidden="true">
          <img src="/site/boards.jpg" alt="" className="absolute left-0 top-0 h-[86%] w-[78%] rounded-[2rem] object-cover shadow-card" />
          <img src="/site/hob.jpg" alt="" className="absolute right-0 top-[10%] h-[46%] w-[42%] rounded-3xl border-4 border-ice object-cover shadow-card" />
          <img src="/site/microwave.jpg" alt="" className="absolute bottom-0 right-[6%] h-[36%] w-[38%] rounded-3xl border-4 border-ice object-cover shadow-card" />
          <div className="absolute bottom-[2%] left-[4%] rounded-2xl bg-navy px-4 py-3 text-white shadow-btn"><div className="text-sm font-bold">Quote in one list</div><div className="text-xs text-slate-300">Add many items, send once</div></div>
        </div>
      </Container>
    </section>
  )
}
