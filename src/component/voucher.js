import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loading from './loading';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Voucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newVoucher, setNewVoucher] = useState({
        id: '',
        name: '',
        description: '',
        discount: ''
    });
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            setError('Token tidak ditemukan, silakan login kembali');
            setTimeout(() => {
                navigate('/');
            }, 200);
            return;
        }

        axios.get('https://skripsi-api-859835962101.asia-southeast2.run.app/voucher', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page: currentPage,
                limit: 10,
            }
        })
            .then((response) => {
                if (response.data.status) {
                    setVouchers(response.data.data);
                    setTotalPages(response.data.pagination.last_page);
                } else {
                    setError('Gagal mendapatkan data voucher');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching vouchers:", error);
                setError('Terjadi kesalahan saat mengambil data voucher');
                setLoading(false);
            });
    }, [currentPage]);

    const handleDeleteVoucher = (voucherId) => {
        console.log(`Deleting voucher with ID: ${voucherId}`);
        setShowDeleteDialog(false);
    };

    const handleDetailVoucher = (voucher) => {
        setSelectedVoucher(voucher);
        setShowDetailDialog(true);
    };

    const handleCreateVoucher = () => {
        const token = Cookies.get('token');
        if (!token) {
            setError('Token tidak ditemukan, silakan login kembali');
            setTimeout(() => {
                navigate('/');
            }, 200);
            return;
        }

        axios.post(
            'https://skripsi-api-859835962101.asia-southeast2.run.app/voucher',
            newVoucher,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => {
                if (response.data.status) {
                    setVouchers([...vouchers, newVoucher]);
                    setShowCreateDialog(false);
                    setNewVoucher({
                        id: '',
                        name: '',
                        description: '',
                        discount: ''
                    });
                } else {
                    setError('Gagal membuat voucher');
                }
            })
            .catch((error) => {
                console.error("Error creating voucher:", error);
                setError('Terjadi kesalahan saat membuat voucher');
            });
    };

    const handleCloseDialog = () => {
        setShowDeleteDialog(false);
        setShowDetailDialog(false);
        setShowCreateDialog(false);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="font-medium text-blue-300 text-3xl mt-20">Daftar Voucher</h1>

            <button
                onClick={() => setShowCreateDialog(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-800 text-white rounded-lg mt-10"
            >
                Buat Voucher
            </button>

            <div className="p-4 border-2 border-gray-200 rounded-lg mt-10">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right">
                        <thead className="text-xs text-white uppercase bg-blue-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">No</th>
                                <th scope="col" className="px-6 py-3">Kode</th>
                                <th scope="col" className="px-6 py-3">Nama Voucher</th>
                                <th scope="col" className="px-6 py-3">Diskon</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher, index) => (
                                <tr key={voucher.id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="px-6 py-3">{index + 1}</td>
                                    <td className="px-6 py-3">{voucher.id}</td>
                                    <td className="px-6 py-3">{voucher.name}</td>
                                    <td className="px-6 py-3">{voucher.discount}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex gap-2">
                                            <button className="text-white bg-blue-300 hover:bg-blue-500 font-medium rounded-lg text-sm px-3 py-2 flex items-center">
                                                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteDialog(true)}
                                                className="text-white bg-red-500 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDetailVoucher(voucher)}
                                                className="text-white bg-green-500 hover:bg-green-700 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg ${page === currentPage
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </div>

            {showDeleteDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus voucher ini?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleDeleteVoucher(selectedVoucher?.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                            >
                                Hapus
                            </button>
                            <button
                                onClick={handleCloseDialog}
                                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDetailDialog && selectedVoucher && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                        <h2 className="text-xl font-semibold mb-4">{selectedVoucher.name}</h2>
                        <div className="text-sm text-gray-600 mb-4">
                            <p><strong>Kode:</strong> {selectedVoucher.id}</p>
                            <p><strong>Diskon:</strong> Rp {selectedVoucher.discount}</p>
                            <p>{selectedVoucher.description}</p>
                        </div>
                        <button
                            onClick={handleCloseDialog}
                            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {showCreateDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
                        <h2 className="text-lg font-semibold mb-6">Buat Voucher Baru</h2>
                        <div className="mb-6">
                            <label className="block text-gray-600">Kode Voucher</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                value={newVoucher.id}
                                onChange={(e) => setNewVoucher({ ...newVoucher, id: e.target.value })}
                                placeholder="Masukkan kode voucher"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600">Nama Voucher</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                value={newVoucher.name}
                                onChange={(e) => setNewVoucher({ ...newVoucher, name: e.target.value })}
                                placeholder="Masukkan nama voucher"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600">Deskripsi</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                value={newVoucher.description}
                                onChange={(e) => setNewVoucher({ ...newVoucher, description: e.target.value })}
                                placeholder="Masukkan deskripsi voucher"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600">Diskon</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                value={newVoucher.discount}
                                onChange={(e) => setNewVoucher({ ...newVoucher, discount: e.target.value })}
                                placeholder="Masukkan diskon"
                            />
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleCreateVoucher}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700"
                            >
                                Simpan
                            </button>
                            <button
                                onClick={handleCloseDialog}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Voucher;