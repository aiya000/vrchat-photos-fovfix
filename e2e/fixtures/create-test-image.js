const fs = require('fs');

// A minimal 100x100 PNG with a blue square (base64 encoded)
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAAzUlEQVR4nO3SwQ3AIAwEQY6k/5b5BxJK+MFhZqq4sQ7bv3sAAAAAAAAAAAAAAACgI+fcx88e6T3r37P+vZ4VAAAAAAAAAAAAAAAAAID/jCGkMYQ0hpDGENIYQhpDSGMIaQwhjSGkMYQ0hpDGENIYQhpDSGMIaQwhjSGkMYQ0hpDGENIYQhpDSGMIaQwhjSGkMYQ0hpDGENIYQhpDSGMIaQwhjSGkMYQ0hpDGENIYQhpDSGMIaQwhjSGkMYQ0hpDGENJ87BYAAAAAAAAAAAAAAAAAvvQCiXoJqBVnXEMAAAAASUVORK5CYII=';

// Convert base64 to buffer and save
const buffer = Buffer.from(pngBase64, 'base64');
fs.writeFileSync('test-photo.png', buffer);
console.log('Test image created: test-photo.png');
