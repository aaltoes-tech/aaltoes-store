import Image from 'next/image'

export default function Navbar() {
  return (
    <nav>
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <Image 
            src="/aaltoes_white.png" 
            alt="aalto-logo" 
            width={150} 
            height={150} 
            priority
          />
        </div>
        
        <div>{/* Right side space - can be used for other nav items later */}</div>
      </div>
    </nav>
  )
} 