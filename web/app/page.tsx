'use client';

import { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Clock3, Gauge, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const activity = [
  ['Position opened', '+ 1.40 RITUAL', 'YES', '2m'],
  ['Pool moved', '61% → 64%', 'LIVE', '6m'],
  ['Stake reduced', '− 0.35 RITUAL', 'EXIT', '11m'],
];

export default function Home() {
  const [side, setSide] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState('0.50');
  const [yesStake, setYesStake] = useState(1.4);
  const [noStake, setNoStake] = useState(0.25);
  const [notice, setNotice] = useState('Local demo — no wallet transaction will be sent.');
  const numericAmount = Math.max(0, Number(amount) || 0);
  const activeStake = side === 'YES' ? yesStake : noStake;
  const totalPosition = yesStake + noStake;
  const estimatedReturn = useMemo(() => (side === 'YES' ? numericAmount * 1.56 : numericAmount * 2.78), [numericAmount, side]);

  function addStake() {
    if (!numericAmount) return setNotice('Enter an amount greater than zero.');
    side === 'YES' ? setYesStake((v) => v + numericAmount) : setNoStake((v) => v + numericAmount);
    setNotice(`${numericAmount.toFixed(2)} RITUAL added to ${side} in the local demo.`);
  }

  function exitStake() {
    if (!numericAmount || numericAmount > activeStake) return setNotice(`You can exit up to ${activeStake.toFixed(2)} RITUAL on ${side}.`);
    side === 'YES' ? setYesStake((v) => v - numericAmount) : setNoStake((v) => v - numericAmount);
    setNotice(`${numericAmount.toFixed(2)} RITUAL released from ${side} before market close.`);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/8 bg-black/20">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full border border-lime-300/30 bg-lime-300 text-sm font-black text-zinc-950">RX</div>
            <div><p className="text-sm font-semibold tracking-wide">Ritual Exit Desk</p><p className="text-[11px] text-zinc-500">Flexible positions, autonomous outcomes</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-zinc-400 sm:flex"><span className="size-1.5 rounded-full bg-amber-300" /> Local network</span>
            <Button className="rounded-full bg-lime-300 px-4 text-zinc-950 hover:bg-lime-200"><Wallet /> Connect</Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-5 py-7 lg:px-10">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="eyebrow">MARKET #01 · CRYPTO</p><h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Will ETH close above <span className="text-lime-300">$4,000</span>?</h1></div>
          <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.035] px-4 py-3 text-sm"><Clock3 className="size-4 text-amber-300" /><div><p className="text-zinc-500">Betting closes in</p><p className="font-mono font-semibold">02h : 18m : 44s</p></div></div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <article className="panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 sm:px-6"><div><p className="eyebrow">LIVE POOL</p><p className="mt-1 text-sm text-zinc-400">12.84 RITUAL committed</p></div><span className="rounded-full bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-300">OPEN</span></div>
              <div className="p-5 sm:p-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><div className="flex items-end justify-between"><span className="text-sm text-zinc-400">YES pool</span><strong className="text-4xl text-lime-300">64%</strong></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full w-[64%] rounded-full bg-lime-300" /></div><p className="mt-3 font-mono text-sm">8.22 RITUAL</p></div>
                  <div><div className="flex items-end justify-between"><span className="text-sm text-zinc-400">NO pool</span><strong className="text-4xl text-fuchsia-300">36%</strong></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full w-[36%] rounded-full bg-fuchsia-300" /></div><p className="mt-3 font-mono text-sm">4.62 RITUAL</p></div>
                </div>
                <div className="mt-7 grid gap-3 border-t border-white/8 pt-5 sm:grid-cols-3">
                  <Metric icon={<Gauge />} label="Oracle target" value="$4,000 GTE" />
                  <Metric icon={<ShieldCheck />} label="Resolution" value="Ritual TEE" />
                  <Metric icon={<ArrowUpRight />} label="Your exposure" value={`${totalPosition.toFixed(2)} RITUAL`} />
                </div>
              </div>
            </article>

            <article className="panel p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">YOUR POSITION</p><h2 className="mt-1 text-xl font-semibold">Exposure by side</h2></div><span className="font-mono text-sm text-zinc-400">{totalPosition.toFixed(2)} total</span></div><div className="grid gap-3 sm:grid-cols-2"><Position side="YES" value={yesStake} color="lime" /><Position side="NO" value={noStake} color="pink" /></div><p className="mt-4 flex items-center gap-2 text-xs text-zinc-500"><ArrowDownToLine className="size-3.5" />Flexible Exit lets you reduce either position while the market remains open.</p></article>

            <article className="panel"><div className="border-b border-white/8 px-5 py-4"><p className="eyebrow">ACTIVITY</p></div>{activity.map(([title, value, tag, time]) => <div key={title} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-white/6 px-5 py-4 last:border-0"><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-zinc-500">{time} ago</p></div><span className="font-mono text-sm text-zinc-300">{value}</span><span className="w-12 rounded border border-white/8 py-1 text-center text-[10px] text-zinc-500">{tag}</span></div>)}</article>
          </div>

          <aside className="panel h-fit p-5 sm:p-6 xl:sticky xl:top-5">
            <p className="eyebrow">POSITION CONTROL</p><h2 className="mt-2 text-2xl font-semibold">Enter or exit early</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Move with the market until the betting window closes.</p>
            <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-black/30 p-1.5">{(['YES','NO'] as const).map((item) => <button key={item} onClick={() => setSide(item)} className={`rounded-lg py-3 text-sm font-bold transition ${side === item ? item === 'YES' ? 'bg-lime-300 text-zinc-950' : 'bg-fuchsia-300 text-zinc-950' : 'text-zinc-500 hover:text-white'}`}>{item}</button>)}</div>
            <label className="mt-5 block text-xs font-medium text-zinc-400">Amount</label><div className="mt-2 flex items-center rounded-xl border border-white/10 bg-black/25 px-4 focus-within:border-lime-300/50"><input aria-label="RITUAL amount" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className="min-w-0 flex-1 bg-transparent py-4 font-mono text-xl outline-none" /><span className="text-xs font-semibold text-zinc-500">RITUAL</span></div>
            <div className="mt-4 space-y-2 border-y border-white/8 py-4 text-sm"><Row label="Available to exit" value={`${activeStake.toFixed(2)} RITUAL`} /><Row label="Estimated return" value={`${estimatedReturn.toFixed(2)} RITUAL`} /><Row label="Exit fee" value="0.00 RITUAL" /></div>
            <div className="mt-5 grid grid-cols-2 gap-2"><Button onClick={addStake} className="h-11 bg-lime-300 text-zinc-950 hover:bg-lime-200"><ArrowUpRight /> Add</Button><Button onClick={exitStake} variant="outline" className="h-11 border-white/10 bg-white/4 hover:bg-white/8"><ArrowDownToLine /> Exit</Button></div>
            <p aria-live="polite" className="mt-4 min-h-10 rounded-lg bg-white/[0.035] px-3 py-2.5 text-xs leading-5 text-zinc-400">{notice}</p>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-zinc-600">Built by sanshos1 · Ritual Workshop 2</p>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] p-3 text-zinc-500 [&_svg]:size-4 [&_svg]:text-lime-300"><div>{icon}</div><div><p className="text-[11px]">{label}</p><p className="mt-0.5 text-sm font-medium text-zinc-200">{value}</p></div></div>; }
function Position({ side, value, color }: { side: string; value: number; color: 'lime' | 'pink' }) { return <div className="rounded-xl border border-white/8 bg-black/20 p-4"><div className="flex items-center justify-between"><span className={`text-xs font-bold ${color === 'lime' ? 'text-lime-300' : 'text-fuchsia-300'}`}>{side}</span><span className="font-mono text-lg">{value.toFixed(2)}</span></div><div className="mt-3 h-1 rounded-full bg-white/8"><div className={`h-full rounded-full ${color === 'lime' ? 'bg-lime-300' : 'bg-fuchsia-300'}`} style={{ width: `${Math.min(100, value * 45)}%` }} /></div></div>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between"><span className="text-zinc-500">{label}</span><span className="font-mono text-xs text-zinc-300">{value}</span></div>; }
