import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">Let&apos;s talk.</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            Whether you&apos;re looking for enterprise pricing, need support with your account, or just want to report a bug — our team is ready to help.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
              <div>
                <h3 className="font-medium text-foreground">Email us</h3>
                <p className="text-muted-foreground text-sm mt-1">support@jobzee.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <MessageSquare className="h-6 w-6 text-primary mr-4 mt-1" />
              <div>
                <h3 className="font-medium text-foreground">Live Chat</h3>
                <p className="text-muted-foreground text-sm mt-1">Available 9am - 5pm EST</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <form className="space-y-6 flex flex-col h-full">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Name</label>
              <input 
                id="name" 
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                placeholder="Jane Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Work Email</label>
              <input 
                id="email" 
                type="email"
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                placeholder="jane@company.com" 
              />
            </div>
            <div className="space-y-2 flex-grow">
              <label className="text-sm font-medium" htmlFor="message">Message</label>
              <textarea 
                id="message" 
                className="w-full h-32 bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" 
                placeholder="How can we help you?" 
              />
            </div>
            <button className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90 mt-auto">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
