# Simple Online Shop
Project ini dibangun pada saat mengikuti online course dari Udemy </br>
https://www.udemy.com/course/nodejs-the-complete-guide/

## Web Stack
- Node.js
- Express
- MongoDB Atlas

## Live Preview
Web ini telah dideploy di [heroku](https://www.heroku.com/) untuk mencoba secara langsung klik link berikut  <br/>
https://simple-onlineshop.herokuapp.com/

Anda dapat membuat akun baru atau login menggunakan user berikut <br/>
user: john.doe@test.com <br/>
pass: 123456

## Fitur
- Login dan Signup
- Menampilkan seluruh daftar produk
- Menampilkan daftar produk yang hanya dimiliki user tertentu
- Menambahkan produk baru
- Edit dan Hapus produk hanya dapat dilakukan oleh user yang menambahkan produk
- Menambahkan produk ke keranjang
- Melakukan checkout produk yang terdapat di keranjang
- Pembayaran menggunakan [Stripe](https://stripe.com/) sebagai payment gateway
- Menampilkan seluruh daftar transaksi
- Mendownload invoice
- Terdapat fitur lupa password
- Password yang tersimpan di database dienkripsi menggunakan package bcryptjs
- Email pada saat membuat akun dan untuk mengubah password dikirim menggunakan package nodemailer.
- Validasi dan sanitasi data yang dimasukkan user menggunakan package express-validator

## Dummy Credit Card

Agar proses pembayaran berhasil masukkan informasi berikut

- 4242 4242 4242 4242 sebagai nomor kartu
- Masukkan tanggal kedaluwarsa kartu di masa mendatang
- Masukkan nomor 3 digit untuk CVC
- Masukkan kode pos penagihan apa pun

### Notes
Pada saat web tidak digunakan dalam waktu yang lama heroku akan mematikan server sehingga gambar yang diupload user pada saat menambahkan produk baru akan terhapus. 