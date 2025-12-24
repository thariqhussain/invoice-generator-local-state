export default function LandingPage() {
    return(
        <div>
            <svg viewBox="0 90 800 600" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#0a1628", stopOpacity:1}} />
                    <stop offset="50%" style={{stopColor:"#1a2942", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#2d1b4e", stopOpacity:1}} />
                </linearGradient>
                
                <linearGradient id="laptopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#4a9eff", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#a855f7", stopOpacity:1}} />
                </linearGradient>
                
                <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#1e3a5f", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#0f1c2e", stopOpacity:1}} />
                </linearGradient>
                
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                
                <filter id="shadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
                    <feOffset dx="0" dy="15" result="offsetblur"/>
                    <feFlood floodColor="#000000" floodOpacity="0.4"/>
                    <feComposite in2="offsetblur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <rect width="800" height="600" fill="url(#bgGradient)"/>
        
            
            <g filter="url(#shadow)">
                <g transform="translate(200, 420)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="200,420; 220,415; 200,420"
                        dur="2.5s"
                        repeatCount="indefinite"/>
                    
                    <g transform="rotate(-10)">
                        <rect x="-45" y="-35" width="50" height="70" 
                            fill="#ffffff" stroke="#4a9eff" strokeWidth="1.5" rx="2"/>
                        
                        <path d="M -45,-35 L -20,-20 L -45,-5" 
                            fill="#e8f4ff" stroke="#4a9eff" strokeWidth="1"/>
                        
                        <rect x="-40" y="-30" width="40" height="8" fill="#4a9eff" opacity="0.6" rx="1"/>
                        <text x="-38" y="-24" fontFamily="Arial" fontSize="5" fill="#ffffff" fontWeight="bold">INVOICE</text>
                        
                        <line x1="-40" y1="-15" x2="-10" y2="-15" stroke="#4a9eff" strokeWidth="1" opacity="0.4"/>
                        <line x1="-40" y1="-10" x2="-15" y2="-10" stroke="#6db3f2" strokeWidth="0.8" opacity="0.3"/>
                        
                        <rect x="-40" y="-3" width="35" height="3" fill="#4a9eff" opacity="0.2" rx="0.5"/>
                        <rect x="-40" y="2" width="30" height="3" fill="#4a9eff" opacity="0.2" rx="0.5"/>
                        <rect x="-40" y="7" width="38" height="3" fill="#4a9eff" opacity="0.2" rx="0.5"/>
                        
                        <line x1="-40" y1="13" x2="-8" y2="13" stroke="#4a9eff" strokeWidth="1.5" opacity="0.5"/>
                        
                        <rect x="-40" y="17" width="35" height="5" fill="#a855f7" opacity="0.3" rx="0.5"/>
                        <text x="-38" y="21" fontFamily="Arial" fontSize="4" fill="#4a9eff" fontWeight="bold">Total: $XXX</text>
                        
                        <line x1="-40" y1="26" x2="-12" y2="26" stroke="#6db3f2" strokeWidth="0.6" opacity="0.3"/>
                        <line x1="-40" y1="29" x2="-18" y2="29" stroke="#6db3f2" strokeWidth="0.6" opacity="0.3"/>
                        
                        <path d="M 5,35 L 5,25 L -5,35 Z" fill="#d0e8ff" stroke="#4a9eff" strokeWidth="0.8"/>
                    </g>
                    
                    <path d="M -50,0 Q -35,-5 -20,-8" 
                        stroke="#4a9eff" strokeWidth="2" 
                        strokeDasharray="4,4" 
                        fill="none" 
                        opacity="0.3">
                        <animate attributeName="stroke-dashoffset" 
                            from="0" to="20" 
                            dur="1s" 
                            repeatCount="indefinite"/>
                    </path>
                    
                    <line x1="-52" y1="-5" x2="-42" y2="-7" stroke="#6db3f2" strokeWidth="1.5" opacity="0.4">
                        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite"/>
                    </line>
                    <line x1="-54" y1="5" x2="-44" y2="3" stroke="#6db3f2" strokeWidth="1.5" opacity="0.3">
                        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.8s" repeatCount="indefinite"/>
                    </line>
                </g>
            </g>
            
            <g>
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 0,-10; 0,0"
                    dur="3s"
                    repeatCount="indefinite"/>
                
                <g transform="translate(520, 350)" filter="url(#shadow)">
                    <path d="M -100,35 L -90,0 L 90,0 L 100,35 Z" 
                        fill="url(#laptopGradient)" stroke="#6bb6ff" strokeWidth="3"/>
                    
                    <g opacity="0.4">
                        <rect x="-80" y="8" width="160" height="22" fill="#1e3a5f" rx="2"/>
                        <line x1="-75" y1="15" x2="75" y2="15" stroke="#0a1628" strokeWidth="1"/>
                        <line x1="-75" y1="22" x2="75" y2="22" stroke="#0a1628" strokeWidth="1"/>
                    </g>
                    
                    <rect x="-30" y="12" width="60" height="16" fill="#1e3a5f" rx="2" opacity="0.5" stroke="#4a9eff" strokeWidth="1"/>
                    
                    <path d="M -95,0 L -85,-95 L 85,-95 L 95,0 Z" 
                        fill="url(#screenGradient)" stroke="#6bb6ff" strokeWidth="3"/>
                    
                    <path d="M -90,-5 L -80,-90 L 80,-90 L 90,-5 Z" 
                        fill="#0a1628" stroke="#4a9eff" strokeWidth="1"/>
                    
                    <rect x="-75" y="-85" width="150" height="75" fill="#0f1c2e" rx="3"/>
                    
                    <rect x="-73" y="-83" width="146" height="71" fill="#4a9eff" opacity="0.2" rx="2"/>
                    
                    <line x1="-65" y1="-75" x2="-25" y2="-75" stroke="#4a9eff" strokeWidth="3" opacity="0.7"/>
                    <line x1="-65" y1="-63" x2="45" y2="-63" stroke="#6bb6ff" strokeWidth="2" opacity="0.6"/>
                    <line x1="-65" y1="-51" x2="25" y2="-51" stroke="#4a9eff" strokeWidth="2" opacity="0.5"/>
                    <line x1="-65" y1="-39" x2="55" y2="-39" stroke="#a855f7" strokeWidth="2" opacity="0.6"/>
                    
                    <circle cx="50" cy="-25" r="10" fill="#4a9eff" opacity="0.4"/>
                    <rect x="-65" y="-30" width="15" height="15" fill="#6bb6ff" opacity="0.4" rx="2"/>
                    
                    <circle cx="0" cy="-93" r="2.5" fill="#4a9eff" opacity="0.9"/>
                    
                    <ellipse cx="0" cy="-70" rx="40" ry="15" fill="#ffffff" opacity="0.05"/>
                </g>
            </g>
            
            <g transform="translate(320, 200)" filter="url(#shadow)">
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="320,200; 320,190; 320,200"
                    dur="2.8s"
                    repeatCount="indefinite"/>
                
                <circle cx="0" cy="0" r="35" fill="#4a9eff" opacity="0.2" stroke="#4a9eff" strokeWidth="2.5"/>
                
                <circle cx="0" cy="-6" r="10" fill="#4a9eff"/>
                <path d="M -15,18 Q -15,6 0,6 Q 15,6 15,18 Z" fill="#4a9eff"/>
                
                <text x="0" y="50" fontFamily="Arial" fontSize="14" fill="#4a9eff" textAnchor="middle" fontWeight="bold">Clients</text>
            </g>
            
            <g transform="translate(720, 200)" filter="url(#shadow)">
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="720,200; 720,190; 720,200"
                    dur="3.2s"
                    repeatCount="indefinite"/>
                
                <circle cx="0" cy="0" r="35" fill="#a855f7" opacity="0.2" stroke="#a855f7" strokeWidth="2.5"/>
                
                <rect x="-14" y="-6" width="28" height="20" fill="none" stroke="#a855f7" strokeWidth="2.5" rx="1"/>
                <path d="M -17,-6 L 0,-14 L 17,-6" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinejoin="round"/>
                <rect x="-7" y="3" width="6" height="11" fill="#a855f7"/>
                <rect x="3" y="0" width="6" height="7" fill="#a855f7"/>
                
                <text x="0" y="50" fontFamily="Arial" fontSize="14" fill="#a855f7" textAnchor="middle" fontWeight="bold">Vendors</text>
            </g>
            
            <g transform="translate(720, 500)" filter="url(#shadow)">
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="720,500; 720,490; 720,500"
                    dur="2.6s"
                    repeatCount="indefinite"/>
                
                <circle cx="0" cy="0" r="35" fill="#6bb6ff" opacity="0.2" stroke="#6bb6ff" strokeWidth="2.5"/>
                
                <rect x="-14" y="-14" width="28" height="28" fill="none" stroke="#6bb6ff" strokeWidth="2.5" rx="1"/>
                <line x1="-14" y1="-5" x2="14" y2="-5" stroke="#6bb6ff" strokeWidth="2.5"/>
                <line x1="-14" y1="4" x2="14" y2="4" stroke="#6bb6ff" strokeWidth="2.5"/>
                <line x1="-5" y1="-14" x2="-5" y2="14" stroke="#6bb6ff" strokeWidth="2.5"/>
                <line x1="5" y1="-14" x2="5" y2="14" stroke="#6bb6ff" strokeWidth="2.5"/>
                <rect x="-5" y="9" width="10" height="5" fill="#6bb6ff"/>
                
                <text x="0" y="50" fontFamily="Arial" fontSize="14" fill="#6bb6ff" textAnchor="middle" fontWeight="bold">Companies</text>
            </g>
            
            <g transform="translate(320, 500)" filter="url(#shadow)">
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="320,500; 320,490; 320,500"
                    dur="3.4s"
                    repeatCount="indefinite"/>
                
                <circle cx="0" cy="0" r="35" fill="#ffd93d" opacity="0.2" stroke="#ffd93d" strokeWidth="2.5"/>
                
                <rect x="-14" y="-7" width="28" height="18" fill="none" stroke="#ffa500" strokeWidth="2.5" rx="2"/>
                <rect x="-7" y="-12" width="14" height="6" fill="none" stroke="#ffa500" strokeWidth="2.5" rx="1"/>
                <line x1="-14" y1="2" x2="14" y2="2" stroke="#ffa500" strokeWidth="2.5"/>
                <circle cx="0" cy="2" r="2.5" fill="#ffa500"/>
                
                <text x="0" y="50" fontFamily="Arial" fontSize="14" fill="#ffa500" textAnchor="middle" fontWeight="bold">Consultants</text>
            </g>
            
            <g opacity="0.2">
                <line x1="350" y1="225" x2="450" y2="300" stroke="#4a9eff" strokeWidth="2" strokeDasharray="8,8"/>
                <line x1="690" y1="225" x2="590" y2="300" stroke="#a855f7" strokeWidth="2" strokeDasharray="8,8"/>
                <line x1="690" y1="475" x2="590" y2="400" stroke="#6bb6ff" strokeWidth="2" strokeDasharray="8,8"/>
                <line x1="350" y1="475" x2="450" y2="400" stroke="#ffa500" strokeWidth="2" strokeDasharray="8,8"/>
            </g>
            
            <circle cx="580" cy="320" r="3" fill="#4a9eff" opacity="0.4">
                <animate attributeName="cy" values="320;310;320" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="620" cy="340" r="2" fill="#a855f7" opacity="0.3">
                <animate attributeName="cy" values="340;335;340" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="180" cy="380" r="2.5" fill="#4a9eff" opacity="0.4">
                <animate attributeName="cy" values="380;372;380" dur="2.8s" repeatCount="indefinite"/>
            </circle>
            </svg>
        </div>
    )
}