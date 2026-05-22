export function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-purple w-[700px] h-[700px] -top-48 -left-48 animate-float-slow" />
      <div className="orb orb-pink w-[500px] h-[500px] top-1/4 -right-24 animate-float-reverse" />
      <div className="orb orb-blue w-[350px] h-[350px] bottom-10 left-1/4 animate-float" />
      <div className="orb orb-cyan w-[200px] h-[200px] top-2/3 right-1/3 animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[15%] left-[55%] w-1 h-1 rounded-full bg-purple-300/60 animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-pink-300/40 animate-float-reverse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[35%] left-[20%] w-1 h-1 rounded-full bg-blue-300/50 animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[50%] left-[40%] w-0.5 h-0.5 rounded-full bg-white/40 animate-float-slow" style={{ animationDelay: '2s' }} />
    </div>
  );
}
