export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-8">About JobZee</h1>
        <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
          <p>
            JobZee is a leading tech talent platform designed for the modern workforce. We believe that finding your dream job or the perfect candidate shouldn&apos;t be a fragmented, painful experience.
          </p>
          <p>
            Our mission is to build the highest-quality bridge between ambitious professionals and the world&apos;s most innovative companies. Built with a focus on design, speed, and intelligence, JobZee redefines what a job board can be.
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-12 mb-4">Our Values</h2>
          <ul className="list-none space-y-4 pl-0">
            <li className="flex gap-4">
              <span className="font-bold text-primary">—</span>
              <span><strong>Design matters.</strong> We believe interfaces should be beautiful, intuitive, and blisteringly fast.</span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-primary">—</span>
              <span><strong>Quality over quantity.</strong> We focus on curating high-signal opportunities and deeply vetted talent.</span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-primary">—</span>
              <span><strong>Transparency wins.</strong> Salary ranges, remote policies, and hiring timelines should be upfront.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
