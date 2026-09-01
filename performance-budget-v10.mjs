#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || process.cwd();
const ext = /\.(png|jpe?g|webp|avif|gif|svg|js|mjs|css|html)$/i;
const files = fs.existsSync(root) ? fs.readdirSync(root).filter(f => ext.test(f)) : [];
const bytes = files.reduce((sum, file) => sum + fs.statSync(path.join(root,file)).size, 0);
const imageBytes = files.filter(f => /\.(png|jpe?g|webp|avif|gif)$/i.test(f)).reduce((s,f)=>s+fs.statSync(path.join(root,f)).size,0);
const jsBytes = files.filter(f => /\.(js|mjs)$/i.test(f)).reduce((s,f)=>s+fs.statSync(path.join(root,f)).size,0);
const cssBytes = files.filter(f => /\.css$/i.test(f)).reduce((s,f)=>s+fs.statSync(path.join(root,f)).size,0);
const result = {gate:'PERFORMANCE-V10',root,fileCount:files.length,totalBytes:bytes,imageBytes,jsBytes,cssBytes,
  notes:['This gate measures root-level assets; browser waterfalls remain mandatory.','Do not delete originals during optimization.']};
console.log(JSON.stringify(result,null,2));
