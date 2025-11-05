# Assets & Public Files

Folder ini berisi aset statis yang bisa diakses publik:
- `placeholder-logo.svg` - Logo LSP Polstat STIS
- `placeholder-logo.png` - Logo dalam format PNG
- `placeholder-user.jpg` - Placeholder user avatar
- `placeholder.jpg` & `placeholder.svg` - General placeholder images

## Usage

Import atau reference di JSX:
\`\`\`tsx
import Image from 'next/image'
<Image src="/placeholder-logo.svg" alt="Logo" width={48} height={48} />
\`\`\`

Atau langsung di URL:
\`\`\`
/placeholder-logo.svg
