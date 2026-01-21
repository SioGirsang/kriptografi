// Algoritma Additive Cipher (Chiper Penjumlahan)

        function additiveEncrypt(plain, key) {
            let k = parseInt(key) % 26; // Pastikan kunci dalam rentang 0-25
            if (isNaN(k)) return "Kunci harus berupa angka!";
            plain = plain.toLowerCase();
            let result = '';
            for (let i = 0; i < plain.length; i++) {
                let code = plain.charCodeAt(i);
                if (code >= 97 && code <= 122) {
                    result += String.fromCharCode(((code - 97 + k) % 26) + 97);
                } else {
                    result += plain[i]; // Karakter non-alfabet tetap sama
                }
            }
            return result.toLowerCase();
        }


        function additiveDecrypt(cipher, key) {
            let k = parseInt(key) % 26; // Pastikan kunci dalam rentang 0-25
            if (isNaN(k)) return "Kunci harus berupa angka!";
            cipher = cipher.toLowerCase();
            let result = '';
            for (let i = 0; i < cipher.length; i++) {
                let code = cipher.charCodeAt(i);
                if (code >= 97 && code <= 122) {
                    result += String.fromCharCode(((code - 97 - k + 26) % 26) + 97);
                } else if (code === 32) { // Menangani spasi
                    result += ' ';
                } else {
                    result += cipher[i]; // Karakter non-alfabet tetap sama
                }
            }
            return result;
        }

        function multiplicativeEncrypt(plain, key) {
            let k = parseInt(key);
            if (isNaN(k) || gcd(k, 26) !== 1) return "Kunci harus berupa angka dan relatif prima dengan 26!";
            plain = plain.toLowerCase();
            let result = '';
            for (let i = 0; i < plain.length; i++) {
                let code = plain.charCodeAt(i);
                if (code >= 97 && code <= 122) {
                    result += String.fromCharCode(((code - 97) * k % 26) + 97);
                } else {
                    result += plain[i]; // Karakter non-alfabet tetap sama
                }
            }
            return result;
        }

        function multiplicativeDecrypt(cipher, key) {
            let k = parseInt(key);
            if (isNaN(k) || gcd(k, 26) !== 1) return "Kunci harus berupa angka dan relatif prima dengan 26!";
            let kInverse = modInverse(k, 26);
            cipher = cipher.toLowerCase();
            let result = '';
            for (let i = 0; i < cipher.length; i++) {
                let code = cipher.charCodeAt(i);
                if (code >= 97 && code <= 122) {
                    result += String.fromCharCode(((code - 97) * kInverse % 26 + 26) % 26 + 97);
                } else {
                    result += cipher[i]; // Karakter non-alfabet tetap sama
                }
            }
            return result;
        }

        function polyalphabeticEncrypt(plain, key) {
            if (!key) return "Kunci tidak boleh kosong!";
            plain = plain.toLowerCase();
            key = key.toLowerCase();
            let result = '';
            let keyIndex = 0;

            for (let i = 0; i < plain.length; i++) {
                let code = plain.charCodeAt(i);
                if (code >= 97 && code <= 122) {
                    let shift = key.charCodeAt(keyIndex % key.length) - 97;
                    result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
                    keyIndex++;
                } else {
                    result += plain[i];
                }
            }
            return result;
        }

        function polyalphabeticDecrypt(cipher, key) {
            if (!key) return "Kunci tidak boleh kosong!";
            cipher = cipher.toLowerCase();
            key = key.toLowerCase();
            let result = '';
            let keyIndex = 0;

            for (let i = 0; i < cipher.length; i++) {
                let code = cipher.charCodeAt(i);
                if (code >= 97 && code <= 122) {
                    let shift = key.charCodeAt(keyIndex % key.length) - 97;
                    result += String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
                    keyIndex++;
                } else {
                    result += cipher[i];
                }
            }
            return result;
        }

        function gcd(a, b) {
            while (b !== 0) {
                let temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }

        function modInverse(a, m) {
            a = a % m;
            for (let x = 1; x < m; x++) {
                if ((a * x) % m === 1) {
                    return x;
                }
            }
            return -1;
        }

        function proses(tipe) {
            const text = document.getElementById('inputText').value;
            const password = document.getElementById('password').value;
            const outputDiv = document.getElementById('output');
            const algorithm = document.getElementById('algorithm').value;

            if (!text || !password) {
                alert("Harap isi teks dan kunci!");
                return;
            }

            if (isNaN(password) || password === "") {
                outputDiv.innerText = "Kunci harus berupa angka!";
                outputDiv.style.color = "red";
                return;
            }

            try {
                let hasil = "";
                if (tipe === 'encrypt') {
                    if (algorithm === 'additive') {
                        hasil = additiveEncrypt(text, password);
                    } else if (algorithm === 'multiplicative') {
                        hasil = multiplicativeEncrypt(text, password);
                    } else if (algorithm === 'polyalphabetic') {
                        hasil = polyalphabeticEncrypt(text, password);
                    }
                } else {
                    if (algorithm === 'additive') {
                        hasil = additiveDecrypt(text, password);
                    } else if (algorithm === 'multiplicative') {
                        hasil = multiplicativeDecrypt(text, password);
                    } else if (algorithm === 'polyalphabetic') {
                        hasil = polyalphabeticDecrypt(text, password);
                    }
                }
                outputDiv.innerText = hasil;
                outputDiv.style.color = "#333";
            } catch (e) {
                outputDiv.innerText = "Error: Pastikan kunci benar dan format data sesuai!";
                outputDiv.style.color = "red";
            }
        }

        // Menambahkan dropdown untuk memilih algoritma
        const algorithmSelect = document.getElementById('algorithm');
        algorithmSelect.innerHTML = `
            <option value="additive">Additive Cipher</option>
            <option value="multiplicative">Multiplicative Cipher</option>
            <option value="polyalphabetic">Polyalphabetic Cipher</option>
        `;

        // Memperbarui fungsi untuk menangani algoritma yang dipilih
        document.getElementById('encryptButton').addEventListener('click', function () {
            const algorithm = algorithmSelect.value;
            const plainText = document.getElementById('inputText').value;
            const key = document.getElementById('password').value;
            let result;

            // Validasi input
            if (!plainText.trim()) {
                showAlert('Silakan masukkan <strong>teks</strong> yang akan dienkripsi!', 'warning', 'Input Kosong');
                return;
            }

            if (!key.trim()) {
                showAlert('Silakan masukkan <strong>kunci</strong> enkripsi!', 'warning', 'Kunci Kosong');
                return;
            }

            // Validasi kunci sesuai algoritma
            if (algorithm === 'additive') {
                const keyNum = parseInt(key);
                if (isNaN(keyNum)) {
                    showAlert('Kunci untuk <strong>Additive Cipher</strong> harus berupa <strong>angka</strong>!<br><br>Contoh: <code>3</code>, <code>7</code>, <code>15</code>', 'error', 'Kunci Invalid');
                    return;
                }
                if (keyNum < 0 || keyNum > 25) {
                    showAlert('Kunci untuk <strong>Additive Cipher</strong> harus dalam rentang <strong>0-25</strong>!<br><br>Anda memasukkan: <code>' + keyNum + '</code>', 'error', 'Kunci Diluar Rentang');
                    return;
                }
            } else if (algorithm === 'multiplicative') {
                const keyNum = parseInt(key);
                if (isNaN(keyNum)) {
                    showAlert('Kunci untuk <strong>Multiplicative Cipher</strong> harus berupa <strong>angka</strong>!', 'error', 'Kunci Invalid');
                    return;
                }
                if (gcd(keyNum, 26) !== 1) {
                    showAlert('Kunci untuk <strong>Multiplicative Cipher</strong> harus <strong>relatif prima dengan 26</strong>!<br><br>Kunci valid: <code>1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25</code><br><br>Anda memasukkan: <code>' + keyNum + '</code>', 'error', 'Kunci Tidak Valid');
                    return;
                }
            } else if (algorithm === 'polyalphabetic') {
                if (!/^[a-zA-Z]+$/.test(key)) {
                    showAlert('Kunci untuk <strong>Polyalphabetic Cipher</strong> harus berupa <strong>huruf saja</strong> (tanpa angka atau simbol)!<br><br>Contoh: <code>SECRET</code>, <code>KEY</code>', 'error', 'Kunci Invalid');
                    return;
                }
            }

            if (algorithm === 'additive') {
                result = additiveEncrypt(plainText, key);
            } else if (algorithm === 'multiplicative') {
                result = multiplicativeEncrypt(plainText, key);
            } else if (algorithm === 'polyalphabetic') {
                result = polyalphabeticEncrypt(plainText, key);
            }

            document.getElementById('output').innerText = result;
            document.getElementById('output').style.color = '#00f5ff';

            // Log process to terminal
            if (typeof window.logProcess === 'function') {
                window.logProcess(algorithm, plainText, key, true);
            }
        });

        document.getElementById('decryptButton').addEventListener('click', function () {
            const algorithm = algorithmSelect.value;
            const cipherText = document.getElementById('inputText').value;
            const key = document.getElementById('password').value;
            let result;

            // Validasi input
            if (!cipherText.trim()) {
                showAlert('Silakan masukkan <strong>teks</strong> yang akan didekripsi!', 'warning', 'Input Kosong');
                return;
            }

            if (!key.trim()) {
                showAlert('Silakan masukkan <strong>kunci</strong> dekripsi!', 'warning', 'Kunci Kosong');
                return;
            }

            // Validasi kunci sesuai algoritma
            if (algorithm === 'additive') {
                const keyNum = parseInt(key);
                if (isNaN(keyNum)) {
                    showAlert('Kunci untuk <strong>Additive Cipher</strong> harus berupa <strong>angka</strong>!<br><br>Contoh: <code>3</code>, <code>7</code>, <code>15</code>', 'error', 'Kunci Invalid');
                    return;
                }
                if (keyNum < 0 || keyNum > 25) {
                    showAlert('Kunci untuk <strong>Additive Cipher</strong> harus dalam rentang <strong>0-25</strong>!<br><br>Anda memasukkan: <code>' + keyNum + '</code>', 'error', 'Kunci Diluar Rentang');
                    return;
                }
            } else if (algorithm === 'multiplicative') {
                const keyNum = parseInt(key);
                if (isNaN(keyNum)) {
                    showAlert('Kunci untuk <strong>Multiplicative Cipher</strong> harus berupa <strong>angka</strong>!', 'error', 'Kunci Invalid');
                    return;
                }
                if (gcd(keyNum, 26) !== 1) {
                    showAlert('Kunci untuk <strong>Multiplicative Cipher</strong> harus <strong>relatif prima dengan 26</strong>!<br><br>Kunci valid: <code>1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25</code><br><br>Anda memasukkan: <code>' + keyNum + '</code>', 'error', 'Kunci Tidak Valid');
                    return;
                }
            } else if (algorithm === 'polyalphabetic') {
                if (!/^[a-zA-Z]+$/.test(key)) {
                    showAlert('Kunci untuk <strong>Polyalphabetic Cipher</strong> harus berupa <strong>huruf saja</strong> (tanpa angka atau simbol)!<br><br>Contoh: <code>SECRET</code>, <code>KEY</code>', 'error', 'Kunci Invalid');
                    return;
                }
            }

            if (algorithm === 'additive') {
                result = additiveDecrypt(cipherText, key);
            } else if (algorithm === 'multiplicative') {
                result = multiplicativeDecrypt(cipherText, key);
            } else if (algorithm === 'polyalphabetic') {
                result = polyalphabeticDecrypt(cipherText, key);
            }

            document.getElementById('output').innerText = result;
            document.getElementById('output').style.color = '#00f5ff';

            // Log process to terminal
            if (typeof window.logProcess === 'function') {
                window.logProcess(algorithm, cipherText, key, false);
            }
        });

        function validatePasswordInput() {
            const passwordInput = document.getElementById('password');
            const algorithm = document.getElementById('algorithm').value;
            const passwordError = document.getElementById('passwordError');
            const value = passwordInput.value.trim();

            // Reset classes
            passwordInput.classList.remove('valid', 'invalid');

            if (value === "") {
                passwordError.style.display = 'none';
                return;
            }

            if (algorithm === 'polyalphabetic') {
                if (/[^a-zA-Z]/.test(value)) {
                    passwordError.innerHTML = "⚠️ Kunci harus berupa <strong>huruf saja</strong>!";
                    passwordError.style.display = 'block';
                    passwordInput.classList.add('invalid');
                } else {
                    passwordError.style.display = 'none';
                    passwordInput.classList.add('valid');
                }
            } else if (algorithm === 'multiplicative') {
                const key = parseInt(value);
                if (isNaN(key)) {
                    passwordError.innerHTML = "⚠️ Kunci harus berupa <strong>angka</strong>!";
                    passwordError.style.display = 'block';
                    passwordInput.classList.add('invalid');
                } else if (gcd(key, 26) !== 1) {
                    passwordError.innerHTML = "⚠️ Kunci harus <strong>relatif prima dengan 26</strong>! (1,3,5,7,9,11,15,17,19,21,23,25)";
                    passwordError.style.display = 'block';
                    passwordInput.classList.add('invalid');
                } else {
                    passwordError.style.display = 'none';
                    passwordInput.classList.add('valid');
                }
            } else { // additive
                const key = parseInt(value);
                if (isNaN(key)) {
                    passwordError.innerHTML = "⚠️ Kunci harus berupa <strong>angka</strong>!";
                    passwordError.style.display = 'block';
                    passwordInput.classList.add('invalid');
                } else if (key < 0 || key > 25) {
                    passwordError.innerHTML = "⚠️ Kunci harus dalam rentang <strong>0-25</strong>!";
                    passwordError.style.display = 'block';
                    passwordInput.classList.add('invalid');
                } else {
                    passwordError.style.display = 'none';
                    passwordInput.classList.add('valid');
                }
            }
        }

        function gcd(a, b) {
            while (b !== 0) {
                let temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }

        document.getElementById('password').addEventListener('input', function () {
            const algorithm = document.getElementById('algorithm').value;
            if (algorithm === 'polyalphabetic') {
                // Hanya izinkan huruf untuk Polyalphabetic
                this.value = this.value.replace(/[^a-zA-Z]/g, '');
            } else {
                // Hanya izinkan angka untuk Additive dan Multiplicative
                this.value = this.value.replace(/[^0-9]/g, '');
                
                // Batasi untuk Additive (0-25)
                if (algorithm === 'additive' && this.value !== '') {
                    const num = parseInt(this.value);
                    if (num > 25) {
                        this.value = '25';
                    }
                }
            }
            validatePasswordInput();
        });

        // Clear password when algorithm changes
        document.getElementById('algorithm').addEventListener('change', function() {
            const passwordInput = document.getElementById('password');
            passwordInput.value = '';
            passwordInput.classList.remove('valid', 'invalid');
            document.getElementById('passwordError').style.display = 'none';
            
            // Update placeholder sesuai algoritma
            const algorithm = this.value;
            if (algorithm === 'polyalphabetic') {
                passwordInput.placeholder = 'Masukkan kunci huruf (contoh: SECRET)';
            } else if (algorithm === 'multiplicative') {
                passwordInput.placeholder = 'Masukkan kunci (1,3,5,7,9,11,15,17,19,21,23,25)';
            } else {
                passwordInput.placeholder = 'Masukkan kunci angka (0-25)';
            }
            
            validatePasswordInput();
        });

        const descriptions = {
            additive: "<div class=\"algo-info additive-info\"><h4>Additive Cipher</h4><p>Menggeser setiap huruf dengan nilai kunci numerik tetap.</p><span class=\"key-hint\">💡 Kunci: Angka 0-25</span></div>",
            multiplicative: "<div class=\"algo-info multiplicative-info\"><h4>Multiplicative Cipher</h4><p>Multiplicative cipher menggunakan perkalian untuk mengenkripsi teks.Rumus nya adalah (a * x) mod 26. Setiap huruf dikalikan dengan kunci tertentu dalam modulo 26. Kunci harus relatif prima dengan 26. Contoh yang tidak bisa di bagi 2 dan di bagi 13</p><span class=\"key-hint\">💡 Kunci: Angka relatif prima dengan 26 (1,3,5,7,9,11,15,17,19,21,23,25)</span></div>",
            polyalphabetic: "<div class=\"algo-info polyalphabetic-info\"><h4>Polyalphabetic Cipher</h4><p>Polyalphabetic cipher menggunakan serangkaian kunci untuk mengenkripsi teks. Setiap huruf teks dienkripsi menggunakan huruf kunci secara bergantian. Contoh: Kunci = 'KEY', maka huruf pertama menggunakan 'K', kedua 'E', ketiga 'Y'.Jika jumlah kunci tidak sama dengan jumlah teks maka kunci akan diulang kembali dari awal.Rumusnya adalah (x + k) mod 26 untuk enkripsi dan (x - k + 26) mod 26 untuk dekripsi.</p> <span class=\"key-hint\">💡 Kunci: Kata/teks (misal: SECRET)</span></div>"
        };

        document.getElementById('algorithm').addEventListener('change', function () {
            const selectedAlgorithm = this.value;
            const descriptionDiv = document.getElementById('algorithmDescription');

            if (descriptions[selectedAlgorithm]) {
                descriptionDiv.innerHTML = descriptions[selectedAlgorithm];
                descriptionDiv.style.display = 'block';
            } else {
                descriptionDiv.style.display = 'none';
            }
        });