const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuItems = document.querySelector('.mobile-menu-items');
const menuOpenIcon = document.querySelector('.menu-open-icon');
const menuCloseIcon = document.querySelector('.menu-close-icon');

// IPv4 Address Elements
const ipv4Form = document.querySelector('#ipv4-form');
const ipv4Address = document.querySelector('#ipv4Address');
const ipv4Results = document.querySelector('#ipv4-results');
const octetBreakdown = document.querySelector('#octet-breakdown');
const binaryTables = document.querySelector('#binary-tables');
const finalBinaryResult = document.querySelector('#final-binary-result');
const resetButton = document.querySelector('.reset-btn');

// IPv6 Address Elements
const ipv6Form = document.querySelector('#ipv6-form');
const ipv6Address = document.querySelector('#ipv6Address');
const ipv6Results = document.querySelector('#ipv6-results');
const hextetBreakdown = document.querySelector('#hextet-breakdown');
const ipv6BinaryTables = document.querySelector('#ipv6-binary-tables');
const ipv6FinalBinaryResult = document.querySelector('#ipv6-final-binary-result');

// MAC Address Elements
const macForm = document.querySelector('#mac-form');
const macAddress = document.querySelector('#macAddress');
const macResults = document.querySelector('#mac-results');
const macByteBreakdown = document.querySelector('#mac-byte-breakdown');
const macBinaryTables = document.querySelector('#mac-binary-tables');
const macFinalBinaryResult = document.querySelector('#mac-final-binary-result');
const macStructure = document.querySelector('#mac-structure');

// Open and close Hamburger Menu 
let isMenuOpen = false;

mobileMenuToggle.addEventListener('click', () => {
    if (isMenuOpen) {
        // Close the menu by sliding right
        mobileMenuItems.style.transform = 'translateX(100%)';
        menuOpenIcon.style.display = 'inline-block';
        menuCloseIcon.style.display = 'none';

        isMenuOpen = false;
    } else {
        // Open the menu by sliding left
        mobileMenuItems.style.transform = 'translateX(0)';
        menuOpenIcon.style.display = 'none';
        menuCloseIcon.style.display = 'inline-block';

        isMenuOpen = true;
    }
});

// IPv4 to Binary Converter

ipv4Form.addEventListener('submit', (e) => {
    e.preventDefault();

    const ipAddress = ipv4Address.value.trim();
    const octets = ipAddress.split('.');

    if (octets.length !== 4) {
        alert('Invalid IPv4 address. Please enter exactly four octets.');
        return;
    }

    for (let i = 0; i < octets.length; i++) {
        const octet = octets[i];

        if (!/^\d+$/.test(octet) || Number(octet) > 255) {
            alert('Invalid IPv4 address. Each octet must be a number between 0 and 255.');
            return;
        }
    }

    const binaryOctets = [];

    for (let i = 0; i < octets.length; i++) {
        const decimal = Number(octets[i]);

        const binary = decimal.toString(2).padStart(8, '0');
        binaryOctets.push(binary);
    }

    const fullBinaryAddress = binaryOctets.join('.');

    octetBreakdown.innerHTML = '';

    // Looping through the octets
    for (let i = 0; i < octets.length; i++) {
        const octetNumber = i + 1;
        const decimal = octets[i];
        const binary = binaryOctets[i];

       const octetCard = `
        <div class="octet-card">
            <h4>Octet ${octetNumber}</h4>
            <p>Decimal: ${decimal}</p>
            <p>Binary: ${binary}</p>
        </div>
    `;
        octetBreakdown.innerHTML += octetCard;

    }

    // Creating the powers of two array
    const powersOfTwo = [128, 64, 32, 16, 8, 4, 2, 1];
    binaryTables.innerHTML = '';

    for (let i = 0; i < octets.length; i++) {
        const octetNumber = i + 1;
        const decimal = Number(octets[i]);
        const binary = binaryOctets[i];

        let powerCells = '';
        let bitCells = '';

        for (let j = 0; j < powersOfTwo.length; j++) {
            powerCells += `<th>${powersOfTwo[j]}</th>`;
            bitCells += `<td>${binary[j]}</td>`;
        }

        const conversionTable = `
            <div class="conversion-table-card">
            <h4>Octet ${octetNumber}: ${decimal}</h4>
            <table>
                <thead>
                    <tr>
                        ${powerCells}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        ${bitCells}
                    </tr>
                </tbody>
            </table>
            <p>Binary Result: ${binary}</p>
            </div>`;

        binaryTables.innerHTML += conversionTable;
    }

    // IPv4 Text Content
    finalBinaryResult.textContent = fullBinaryAddress;
    ipv4Results.style.display = 'block';

    // Smoothly scroll to the conversion results
    ipv4Results.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

});

// IPv6 to Binary Converter

ipv6Form.addEventListener('submit', (e) => {
    e.preventDefault();

    const ipAddress = ipv6Address.value.trim();

    // Validate and expand IPv6 address
    let hextets = ipAddress.split(':');

    if (ipAddress.includes('::')) {
        if (ipAddress.split('::').length !== 2) {
            alert('Invalid IPv6 address.');
            return;
        }

        const parts = ipAddress.split('::');
        const left = parts[0] ? parts[0].split(':') : [];
        const right = parts[1] ? parts[1].split(':') : [];

        const missingGroups = 8 - (left.length + right.length);

        if (missingGroups < 1) {
            alert('Invalid IPv6 address.');
            return;
        }

        hextets = [
            ...left,
            ...Array(missingGroups).fill('0'),
            ...right
        ];
    }

    if (hextets.length !== 8) {
        alert('Invalid IPv6 address. Expected eight hextets.');
        return;
    }

    for (let i = 0; i < hextets.length; i++) {
        if (!/^[0-9a-fA-F]{1,4}$/.test(hextets[i])) {
            alert('Invalid IPv6 address. Each hextet must contain 1 to 4 hexadecimal digits.');
            return;
        }
    }

    // Convert hextets to binary
    const binaryHextets = [];

    for (let i = 0; i < hextets.length; i++) {
        const decimal = parseInt(hextets[i], 16);
        const binary = decimal.toString(2).padStart(16, '0');

        binaryHextets.push(binary);
    }

    const fullBinaryAddress = binaryHextets.join(':');

    // Display hextet cards
    hextetBreakdown.innerHTML = '';

    for (let i = 0; i < hextets.length; i++) {
        const hextetNumber = i + 1;
        const hexadecimal = hextets[i].padStart(4, '0');
        const binary = binaryHextets[i].match(/.{4}/g).join(' ');

        const hextetCard = `
            <div class="octet-card">
            <h4>Hextet ${hextetNumber}</h4>
            <p>Hex: ${hexadecimal.toUpperCase()}</p>

            <div class="hextet-binary">
                <span class="binary-label">Binary:</span>
                <span class="binary-value">${binary}</span>
            </div>
        </div>
        `;

        hextetBreakdown.innerHTML += hextetCard;
    }

// Create beginner-friendly 4-bit nibble conversion tables
    const powersOfTwo = [8, 4, 2, 1];

    ipv6BinaryTables.innerHTML = '';

    for (let i = 0; i < hextets.length; i++) {
        const hextetNumber = i + 1;
        const hexadecimal = hextets[i].padStart(4, '0').toUpperCase();

        let nibbleRows = '';
        let combinedBinary = '';

        // Convert each hexadecimal digit into a 4-bit nibble
        for (let j = 0; j < hexadecimal.length; j++) {
            const hexDigit = hexadecimal[j];
            const decimal = parseInt(hexDigit, 16);
            const nibble = decimal.toString(2).padStart(4, '0');

            combinedBinary += nibble;

            nibbleRows += `
                <tr>
                    <th scope="row">${hexDigit}</th>
                    <td>${nibble[0]}</td>
                    <td>${nibble[1]}</td>
                    <td>${nibble[2]}</td>
                    <td>${nibble[3]}</td>
                    <td>${nibble}</td>
                </tr>
            `;
        }

        const conversionTable = `
            <div class="conversion-table-card">
                <h4>Hextet ${hextetNumber}: ${hexadecimal}</h4>

                <p>
                    Convert each hexadecimal digit into
                    four binary bits:
                </p>

                <table>
                    <thead>
                        <tr>
                            <th>Hex</th>
                            ${powersOfTwo.map(power => `<th>${power}</th>`).join('')}
                            <th>Binary</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${nibbleRows}
                    </tbody>
                </table>

                <p>Binary Result: ${combinedBinary.match(/.{4}/g).join(' ')}</p>
            </div>
        `;

        ipv6BinaryTables.innerHTML += conversionTable;
    }

    // Display final binary address
    ipv6FinalBinaryResult.textContent = fullBinaryAddress;
    ipv6Results.style.display = 'block';

    // Smooth scroll to results
    ipv6Results.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

    // MAC Address to Binary Converter

    macForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const address = macAddress.value.trim();

    // Accept colon-separated or hyphen-separated MAC addresses
    const validMac = /^([0-9a-fA-F]{2})([:-])(?:[0-9a-fA-F]{2}\2){4}[0-9a-fA-F]{2}$/;

    if (!validMac.test(address)) {
        alert('Invalid MAC address. Use 00:1A:2B:3C:4D:5E or 00-1A-2B-3C-4D-5E.');
        return;
    }

    const bytes = address.split(/[:-]/);
    const binaryBytes = [];

    // Convert each hexadecimal byte to 8-bit binary
    for (let i = 0; i < bytes.length; i++) {
        const decimal = parseInt(bytes[i], 16);
        const binary = decimal.toString(2).padStart(8, '0');

        binaryBytes.push(binary);
    }

    const fullBinaryAddress = binaryBytes.join(':');

    // Step 1: Display byte breakdown
    macByteBreakdown.innerHTML = '';

    for (let i = 0; i < bytes.length; i++) {
        const byteNumber = i + 1;
        const hexadecimal = bytes[i].toUpperCase();
        const binary = binaryBytes[i];

        const byteCard = `
            <div class="octet-card">
                <h4>Byte ${byteNumber}</h4>
                <p>Hex: ${hexadecimal}</p>
                <p>Binary: ${binary}</p>
            </div>
        `;

        macByteBreakdown.innerHTML += byteCard;
    }

// Step 2: Generate 4-bit nibble conversion tables
    const powersOfTwo = [8, 4, 2, 1];

    macBinaryTables.innerHTML = '';

    for (let i = 0; i < bytes.length; i++) {
        const byteNumber = i + 1;
        const hexadecimal = bytes[i].toUpperCase();

        let nibbleRows = '';
        let combinedBinary = '';

        // Convert each hexadecimal digit into a 4-bit nibble
        for (let j = 0; j < hexadecimal.length; j++) {
            const hexDigit = hexadecimal[j];
            const decimal = parseInt(hexDigit, 16);
            const nibble = decimal.toString(2).padStart(4, '0');

            combinedBinary += nibble;

            nibbleRows += `
                <tr>
                    <th scope="row">${hexDigit}</th>
                    <td>${nibble[0]}</td>
                    <td>${nibble[1]}</td>
                    <td>${nibble[2]}</td>
                    <td>${nibble[3]}</td>
                    <td>${nibble}</td>
                </tr>
            `;
        }

        const conversionTable = `
            <div class="conversion-table-card">
                <h4>Byte ${byteNumber}: ${hexadecimal}</h4>
                <p>Convert each hexadecimal digit into four binary bits:</p>

                <table>
                    <thead>
                        <tr>
                            <th>Hex</th>
                            ${powersOfTwo.map(power => `<th>${power}</th>`).join('')}
                            <th>Binary</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${nibbleRows}
                    </tbody>
                </table>

                <p>Binary Result: ${combinedBinary.match(/.{4}/g).join(' ')}</p>
            </div>
        `;

        macBinaryTables.innerHTML += conversionTable;
    }

    // Step 3: Display final binary MAC address
    macFinalBinaryResult.textContent = fullBinaryAddress;

    // Step 4: Display traditional MAC address structure
    const oui = bytes.slice(0, 3).join(':').toUpperCase();
    const devicePortion = bytes.slice(3).join(':').toUpperCase();

    macStructure.innerHTML = `
        <div class="octet-card">
            <h4>OUI (First 24 Bits)</h4>
            <p>${oui}</p>
        </div>

        <div class="octet-card">
            <h4>Remaining 24 Bits</h4>
            <p>${devicePortion}</p>
        </div>
    `;

    // Display results and scroll
    macResults.style.display = 'block';

    macResults.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// Reset MAC converter
macForm.addEventListener('reset', () => {
    macResults.style.display = 'none';
});

// Reset IPv6 converter
ipv6Form.addEventListener('reset', () => {
    ipv6Results.style.display = 'none';
});

// Reset Button Functionality
resetButton.addEventListener('click', () => {
    ipv4Results.style.display = 'none';
});