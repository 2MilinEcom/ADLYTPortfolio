const Footer = () => (
  <footer className="w-full h-[120px] flex flex-col items-center justify-center text-center mt-16" style={{background:'#141414'}}>
    <div className="flex gap-8 mb-4">
      <a href="#" className="hover:underline transition" style={{color:'#B3B3B3'}}>About</a>
      <a href="#" className="hover:underline transition" style={{color:'#B3B3B3'}}>Help</a>
      <a href="#" className="hover:underline transition" style={{color:'#B3B3B3'}}>Privacy</a>
      <a href="#" className="hover:underline transition" style={{color:'#B3B3B3'}}>Terms</a>
    </div>
    <div className="flex gap-6 justify-center">
      <a href="#" aria-label="Facebook" className="hover:text-[#E50914] transition" style={{color:'#B3B3B3'}}>
        <svg width="28" height="28" fill="#B3B3B3" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/></svg>
      </a>
      <a href="#" aria-label="Instagram" className="hover:text-[#E50914] transition" style={{color:'#B3B3B3'}}>
        <svg width="28" height="28" fill="#B3B3B3" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"/></svg>
      </a>
      <a href="#" aria-label="Twitter" className="hover:text-[#E50914] transition" style={{color:'#B3B3B3'}}>
        <svg width="28" height="28" fill="#B3B3B3" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37a8.59 8.59 0 0 1-2.72 1.04a4.28 4.28 0 0 0-7.29 3.9A12.13 12.13 0 0 1 3.11 4.9a4.28 4.28 0 0 0 1.32 5.71a4.24 4.24 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.19a4.3 4.3 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2c0-.19-.01-.39-.02-.58A8.72 8.72 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z"/></svg>
      </a>
    </div>
  </footer>
);

export default Footer; 