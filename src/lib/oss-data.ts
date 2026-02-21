export interface OssPackage {
  name: string
  url: string
  licenseType: string
  licenseText: string
}

const mitLicense = (copyright: string): string => `MIT License

${copyright}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

export const ossPackages: OssPackage[] = [
  {
    name: 'Next.js',
    url: 'https://github.com/vercel/next.js',
    licenseType: 'MIT',
    licenseText: mitLicense('Copyright (c) 2025 Vercel, Inc.'),
  },
  {
    name: 'React',
    url: 'https://github.com/facebook/react',
    licenseType: 'MIT',
    licenseText: mitLicense('Copyright (c) Meta Platforms, Inc. and affiliates.'),
  },
  {
    name: 'React DOM',
    url: 'https://github.com/facebook/react',
    licenseType: 'MIT',
    licenseText: mitLicense('Copyright (c) Meta Platforms, Inc. and affiliates.'),
  },
  {
    name: 'JSZip',
    url: 'https://github.com/Stuk/jszip',
    licenseType: 'MIT',
    licenseText: `JSZip is dual licensed. At your choice you may use it under the MIT license *or* the GPLv3 license.

The MIT License
===============

Copyright (c) 2009-2016 Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.`,
  },
  {
    name: 'Zod',
    url: 'https://github.com/colinhacks/zod',
    licenseType: 'MIT',
    licenseText: mitLicense('Copyright (c) 2025 Colin McDonnell'),
  },
  {
    name: 'Tailwind CSS',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    licenseType: 'MIT',
    licenseText: mitLicense('Copyright (c) Tailwind Labs, Inc.'),
  },
]
