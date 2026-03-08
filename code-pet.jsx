import { useState, useEffect, useRef } from "react";

const STAGES = [
  { name: "Commit Egg",   minXP: 0,   body: "#ffe0b2", spots: "#ffcc80", eyes: "#5d4037", label: "🥚" },
  { name: "Tiny Sprout",  minXP: 20,  body: "#c8e6c9", spots: "#a5d6a7", eyes: "#2e7d32", label: "🌱" },
  { name: "Code Kitten",  minXP: 80,  body: "#fff9c4", spots: "#fff176", eyes: "#f57f17", label: "🐱" },
  { name: "Pixel Pup",    minXP: 200, body: "#bbdefb", spots: "#90caf9", eyes: "#1565c0", label: "🐶" },
  { name: "Debug Dragon", minXP: 450, body: "#f8bbd0", spots: "#f48fb1", eyes: "#880e4f", label: "🐉" },
  { name: "Merge Master", minXP: 900, body: "#e1bee7", spots: "#ce93d8", eyes: "#4a148c", label: "⭐" },
];

const ACTIVITIES = [
  { id: "commit",  label: "Commit Code",     xp: 12, icon: "💾", desc: "git commit -m \"...\"" },
  { id: "push",    label: "Push to Remote",  xp: 18, icon: "⬆️",  desc: "git push origin" },
  { id: "pr",      label: "Open a PR",       xp: 30, icon: "🔀", desc: "Pull request opened!" },
  { id: "merge",   label: "Merge a Branch",  xp: 40, icon: "✅", desc: "Branch merged!" },
  { id: "review",  label: "Review a PR",     xp: 22, icon: "👁️",  desc: "Left review comments" },
  { id: "release", label: "Cut a Release",   xp: 55, icon: "🏷️",  desc: "git tag v1.x.x" },
];

const QUIPS = {
  commit:  ["Yay, a commit! 💾", "I felt that push~", "More commits = more happy!"],
  push:    ["We're live-ish! ⬆️", "Remote is happy now!", "Pushed it real good~"],
  pr:      ["Ooh, a PR! 🔀", "Let the reviews begin!", "So collaborative!"],
  merge:   ["MERGED!! 🎉", "Branch begone! ✅", "Clean history = happy me!"],
  review:  ["You reviewed?! 👁️", "Helping the team~", "Great code reader!"],
  release: ["A RELEASE?! 🏷️🎉", "Ship it!!! v++", "You beautiful dev!"],
};

// Pixel art pet using SVG rects
function PixelPet({ stageIdx, animating, bounce, mood }) {
  const s = STAGES[stageIdx];
  const P = 10; // pixel size
  const W = 8; const H = 8;

  const grids = [
    // Egg
    [[0,0,1,1,1,1,0,0],[0,1,1,1,1,1,1,0],[1,1,1,2,2,1,1,1],[1,1,2,1,1,2,1,1],[1,1,1,1,1,1,1,1],[1,1,2,3,3,2,1,1],[0,1,1,1,1,1,1,0],[0,0,1,1,1,1,0,0]],
    // Sprout
    [[0,0,2,2,2,2,0,0],[0,0,2,1,1,2,0,0],[0,1,1,1,1,1,1,0],[1,1,2,1,1,2,1,1],[1,1,1,1,1,1,1,1],[1,1,1,3,3,1,1,1],[0,1,2,1,1,2,1,0],[0,0,1,1,1,1,0,0]],
    // Kitten
    [[1,1,0,0,0,0,1,1],[1,1,1,1,1,1,1,1],[1,2,1,3,3,1,2,1],[1,1,1,1,1,1,1,1],[1,2,1,1,1,1,2,1],[1,1,1,2,2,1,1,1],[0,1,1,1,1,1,1,0],[0,0,2,1,1,2,0,0]],
    // Pup
    [[0,2,0,0,0,0,2,0],[2,2,1,1,1,1,2,2],[0,1,1,3,3,1,1,0],[1,1,1,1,1,1,1,1],[2,1,1,1,1,1,1,2],[1,1,2,2,2,2,1,1],[1,1,1,1,1,1,1,1],[0,2,0,0,0,0,2,0]],
    // Dragon
    [[0,2,1,0,0,1,2,0],[2,1,1,1,1,1,1,2],[1,1,3,1,1,3,1,1],[1,2,1,1,1,1,2,1],[2,1,1,1,1,1,1,2],[1,1,1,2,2,1,1,1],[0,2,1,2,2,1,2,0],[2,0,2,0,0,2,0,2]],
    // Master
    [[2,0,2,1,1,2,0,2],[0,1,1,2,2,1,1,0],[2,1,3,1,1,3,1,2],[1,2,1,1,1,1,2,1],[2,1,1,1,1,1,1,2],[1,1,2,3,3,2,1,1],[2,1,1,2,2,1,1,2],[0,2,1,1,1,1,2,0]],
  ];

  const grid = grids[Math.min(stageIdx, 5)];
  const colorMap = ["transparent", s.body, s.spots, s.eyes, "#f8bbd0"];
  const totalW = W * P;
  const totalH = H * P;

  return (
    <svg
      width={totalW} height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      style={{
        imageRendering: "pixelated",
        filter: animating
          ? `drop-shadow(0 0 12px ${s.spots}) drop-shadow(0 0 24px ${s.body})`
          : `drop-shadow(0 0 5px ${s.spots}88)`,
        transition: "filter 0.3s",
        animation: bounce ? "petBounce 0.45s ease" : "petIdle 2.8s ease-in-out infinite",
      }}
    >
      <circle cx={totalW/2} cy={totalH/2} r={totalW*0.52}
        fill={mood === "happy" ? s.body : mood === "sad" ? "#e0e0e0" : "#fafafa"}
        opacity={0.4} />
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell !== 0 ? (
            <rect key={`${r}-${c}`}
              x={c*P} y={r*P} width={P} height={P}
              fill={colorMap[cell]} rx={1.5} />
          ) : null
        )
      )}
      {/* Blush cheeks when happy */}
      {mood === "happy" && <>
        <rect x={P*1} y={P*4} width={P*1.2} height={P*0.7} fill="#f48fb1" opacity={0.45} rx={4}/>
        <rect x={P*5.8} y={P*4} width={P*1.2} height={P*0.7} fill="#f48fb1" opacity={0.45} rx={4}/>
      </>}
    </svg>
  );
}

function Sparkles({ active }) {
  if (!active) return null;
  const items = ["✨","⭐","💖","🌸","💫"];
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:10 }}>
      {items.map((s,i) => (
        <span key={i} style={{
          position:"absolute",
          left:`${15 + i*16}%`, top:"10%",
          fontSize:"1rem",
          animation:`sp${i%2?"R":"L"} 0.9s ease-out forwards`,
          animationDelay:`${i*0.07}s`,
          opacity:0,
        }}>{s}</span>
      ))}
    </div>
  );
}

export default function CodePet() {
  const [xp, setXP]           = useState(0);
  const [log, setLog]         = useState([]);
  const [speech, setSpeech]   = useState(null);
  const [animating, setAnim]  = useState(false);
  const [bounce, setBounce]   = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [streak, setStreak]   = useState(0);
  const [lastTs, setLastTs]   = useState(Date.now());
  const [levelFlash, setLvlFlash] = useState(false);
  const speechTimer = useRef(null);
  const prevStage = useRef(0);

  const stageIdx = STAGES.reduce((a,s,i) => xp >= s.minXP ? i : a, 0);
  const stage    = STAGES[stageIdx];
  const next     = STAGES[stageIdx + 1];
  const pct      = next ? ((xp - stage.minXP) / (next.minXP - stage.minXP)) * 100 : 100;
  const mood     = Date.now() - lastTs > 4*3600*1000 ? "sad" : xp >= 20 ? "happy" : "neutral";

  useEffect(() => {
    if (stageIdx > prevStage.current) {
      setLvlFlash(true);
      setTimeout(() => setLvlFlash(false), 2200);
    }
    prevStage.current = stageIdx;
  }, [stageIdx]);

  function feed(act) {
    setLastTs(Date.now());
    const ns = streak + 1;
    setStreak(ns);
    const bonus = ns >= 3 ? Math.ceil(act.xp * 0.5) : 0;
    const gained = act.xp + bonus;
    setXP(p => p + gained);

    const q = QUIPS[act.id];
    if (speechTimer.current) clearTimeout(speechTimer.current);
    setSpeech(`${q[Math.floor(Math.random()*q.length)]} +${gained}xp${bonus?" 🔥":""}`);
    speechTimer.current = setTimeout(() => setSpeech(null), 2800);

    setLog(p => [{
      icon: act.icon, label: act.label,
      xp: gained, bonus: bonus > 0,
      time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
    }, ...p.slice(0,6)]);

    setAnim(true); setBounce(true); setSparkle(true);
    setTimeout(() => setAnim(false), 700);
    setTimeout(() => setBounce(false), 450);
    setTimeout(() => setSparkle(false), 1000);
  }

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(150deg,#fdf6ff 0%,#e8f4fd 55%,#fff0f6 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"24px",
      fontFamily:"'Georgia', serif",
    }}>
      <style>{`
        @keyframes petIdle{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-9px) rotate(1.5deg)}}
        @keyframes petBounce{0%,100%{transform:scale(1) translateY(0)}35%{transform:scale(1.13) translateY(-20px)}65%{transform:scale(1.06) translateY(-9px)}}
        @keyframes spL{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(-24px,-46px) scale(0.3)}}
        @keyframes spR{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(24px,-46px) scale(0.3)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes lvlUp{0%,100%{opacity:1;transform:scale(1)}40%{transform:scale(1.35)}70%{transform:scale(1.1)}}
        @keyframes bubble{from{opacity:0;transform:translateX(-50%) scale(0.6)}to{opacity:1;transform:translateX(-50%) scale(1)}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        .act{transition:transform .15s,box-shadow .15s;cursor:pointer;}
        .act:hover{transform:translateY(-3px);box-shadow:0 8px 22px rgba(180,120,220,.28)!important;}
        .act:active{transform:scale(.96);}
      `}</style>

      <div style={{width:"100%",maxWidth:"840px",display:"grid",gridTemplateColumns:"320px 1fr",gap:"20px",alignItems:"start"}}>

        {/* ── PET CARD ── */}
        <div style={{
          background:"white", borderRadius:"28px",
          padding:"28px 22px",
          boxShadow:"0 8px 40px rgba(180,140,220,.18)",
          border:"2px solid #f3e8ff",
          display:"flex",flexDirection:"column",alignItems:"center",gap:"14px",
          position:"relative",overflow:"hidden",
        }}>
          <div style={{position:"absolute",top:-28,right:-28,width:90,height:90,borderRadius:"50%",background:"#fce4ec",opacity:.45,pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:-18,left:-18,width:75,height:75,borderRadius:"50%",background:"#e8f5e9",opacity:.45,pointerEvents:"none"}}/>

          {/* Stage badge */}
          <div style={{
            background:`linear-gradient(135deg,${stage.body},${stage.spots})`,
            borderRadius:"20px",padding:"4px 18px",
            fontSize:".7rem",fontWeight:"700",letterSpacing:".12em",
            textTransform:"uppercase",color:"#4a3060",
            boxShadow:"0 2px 8px rgba(0,0,0,.09)",
          }}>{stage.label} {stage.name}</div>

          {/* Pet display */}
          <div style={{position:"relative",width:90,height:90,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Sparkles active={sparkle} />
            {levelFlash && (
              <div style={{
                position:"absolute",inset:-16,borderRadius:"50%",
                background:`radial-gradient(circle,${stage.spots}bb,transparent 70%)`,
                animation:"lvlUp 2s ease forwards",pointerEvents:"none",
              }}/>
            )}
            <div style={{cursor:"pointer"}} onClick={() => setSpeech("Pet me while you code 💖")}>
              <PixelPet stageIdx={stageIdx} animating={animating} bounce={bounce} mood={mood} />
            </div>
            {speech && (
              <div style={{
                position:"absolute",bottom:"calc(100% + 10px)",left:"50%",
                transform:"translateX(-50%)",
                background:"white",borderRadius:"16px",
                padding:"8px 14px",
                fontSize:".76rem",fontWeight:"600",color:"#4a3060",
                whiteSpace:"nowrap",
                boxShadow:"0 4px 16px rgba(0,0,0,.13)",
                border:"1.5px solid #f3e8ff",
                animation:"bubble .3s cubic-bezier(.34,1.56,.64,1)",
                zIndex:20,
              }}>
                {speech}
                <div style={{position:"absolute",bottom:-7,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent",borderTop:"7px solid white"}}/>
              </div>
            )}
          </div>

          {/* Mood */}
          <div style={{
            fontSize:".8rem",fontWeight:"600",color:"#6d4c9c",
            background:mood==="happy"?"#f3e8ff":mood==="sad"?"#f5f5f5":"#fafafa",
            borderRadius:"12px",padding:"5px 16px",
          }}>
            {mood==="happy"?"😊 Happy & well-fed!":mood==="sad"?"😴 Getting sleepy...":"😐 Feeling peckish..."}
          </div>

          {/* XP bar */}
          <div style={{width:"100%"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:".7rem",color:"#9e7db5",marginBottom:"6px",fontFamily:"monospace"}}>
              <span>⚡ {xp} XP</span>
              <span>{next?`${next.minXP-xp} xp → ${next.name}`:"✨ MAX LEVEL!"}</span>
            </div>
            <div style={{background:"#f3e8ff",borderRadius:"99px",height:"9px",overflow:"hidden"}}>
              <div style={{
                height:"100%",borderRadius:"99px",
                width:`${pct}%`,
                background:`linear-gradient(90deg,${stage.body},${stage.spots})`,
                transition:"width .7s cubic-bezier(.4,0,.2,1)",
                boxShadow:`0 0 8px ${stage.spots}`,
              }}/>
            </div>
          </div>

          {/* Streak */}
          {streak >= 2 && (
            <div style={{fontSize:".78rem",color:"#e67e22",fontWeight:"700",animation:"fadeSlide .3s ease"}}>
              🔥 {streak}-action streak!{streak>=3?" (+50% XP!)":""}
            </div>
          )}

          {/* Evolution path */}
          <div style={{width:"100%"}}>
            <div style={{fontSize:".62rem",color:"#c9b8d8",textTransform:"uppercase",letterSpacing:".1em",marginBottom:"8px"}}>Evolution Path</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"2px"}}>
              {STAGES.map((s,i) => (
                <div key={i} style={{textAlign:"center",opacity:xp>=s.minXP?1:.25,transition:"opacity .5s",flex:1}}>
                  <div style={{fontSize:"1.15rem",lineHeight:1}}>{s.label}</div>
                  <div style={{fontSize:".5rem",color:"#9e7db5",marginTop:"2px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name.split(" ")[0]}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={()=>{if(window.confirm("Reset your pet? 🥚"))setXP(0)||setLog([])||setStreak(0)}} style={{
            background:"none",border:"1px solid #e8d8f5",color:"#c9b8d8",
            borderRadius:"10px",padding:"5px 14px",fontSize:".68rem",cursor:"pointer",marginTop:"2px",
          }}>🔄 Reset pet</button>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
          <div>
            <h1 style={{margin:0,fontSize:"1.65rem",color:"#4a3060",fontWeight:"700",letterSpacing:"-.01em"}}>Code Pet 🌸</h1>
            <p style={{margin:"4px 0 0",fontSize:".83rem",color:"#9e7db5"}}>Every commit counts. Log your Git activity and watch your pet grow!</p>
          </div>

          {/* Activities */}
          <div style={{background:"white",borderRadius:"22px",padding:"22px",boxShadow:"0 4px 24px rgba(180,140,220,.12)",border:"1.5px solid #f3e8ff"}}>
            <div style={{fontSize:".72rem",fontWeight:"700",color:"#9e7db5",textTransform:"uppercase",letterSpacing:".1em",marginBottom:"14px"}}>
              🎮 What just happened?
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
              {ACTIVITIES.map(a => (
                <button key={a.id} className="act" onClick={()=>feed(a)} style={{
                  background:"linear-gradient(135deg,#fdf6ff,#f3e8ff)",
                  border:"1.5px solid #e8d8f5",
                  borderRadius:"16px",padding:"14px 12px",textAlign:"left",
                  boxShadow:"0 2px 10px rgba(180,140,220,.1)",
                }}>
                  <div style={{fontSize:"1.45rem",marginBottom:"5px",lineHeight:1}}>{a.icon}</div>
                  <div style={{fontSize:".76rem",fontWeight:"700",color:"#4a3060",lineHeight:1.3}}>{a.label}</div>
                  <div style={{fontSize:".65rem",color:"#9e7db5",marginTop:"2px"}}>{a.desc}</div>
                  <div style={{fontSize:".7rem",color:"#b36cc8",fontWeight:"700",marginTop:"5px"}}>+{a.xp} XP</div>
                </button>
              ))}
            </div>
          </div>

          {/* Log */}
          <div style={{background:"white",borderRadius:"22px",padding:"22px",boxShadow:"0 4px 24px rgba(180,140,220,.12)",border:"1.5px solid #f3e8ff"}}>
            <div style={{fontSize:".72rem",fontWeight:"700",color:"#9e7db5",textTransform:"uppercase",letterSpacing:".1em",marginBottom:"12px"}}>
              📜 Activity Log
            </div>
            {log.length===0?(
              <div style={{textAlign:"center",padding:"20px 0",color:"#c9b8d8",fontSize:".83rem"}}>
                Waiting for your first commit... 🥚
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
                {log.map((e,i)=>(
                  <div key={i} style={{
                    display:"flex",justifyContent:"space-between",alignItems:"center",
                    background:i===0?"#fdf6ff":"#fafafa",
                    borderRadius:"12px",padding:"8px 12px",
                    border:i===0?"1px solid #e8d8f5":"1px solid transparent",
                    animation:i===0?"slideIn .35s ease":"none",
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <span style={{fontSize:"1.1rem"}}>{e.icon}</span>
                      <div>
                        <div style={{fontSize:".76rem",fontWeight:"600",color:"#4a3060"}}>{e.label}</div>
                        <div style={{fontSize:".66rem",color:e.bonus?"#e67e22":"#b36cc8",fontWeight:"600"}}>+{e.xp} XP{e.bonus?" 🔥 streak bonus!":""}</div>
                      </div>
                    </div>
                    <span style={{fontSize:".66rem",color:"#c9b8d8"}}>{e.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
