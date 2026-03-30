const fs = require('fs');

function fixFile(path) {
  let w = fs.readFileSync(path, 'utf8');
  w = w.replaceAll(/className=\{\\\r?\n\s+flex/g, 'className={\\n                flex');
  w = w.replaceAll(/className=\{\\relative/g, 'className={\elative');
  w = w.replaceAll(/\\\}/g, '\}');
  w = w.replaceAll(/\\\$/g, '\$');
  fs.writeFileSync(path, w);
}

fixFile('E:/From disk D/Unibridge/client/src/app/(dashboard)/warden-dashboard/components/Sidebar.tsx');
fixFile('E:/From disk D/Unibridge/client/src/app/(dashboard)/parent-dashboard/components/Sidebar.tsx');
