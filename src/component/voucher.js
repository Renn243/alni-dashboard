import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEdit, faEye, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import Loading from './loading';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import DM1 from './image/dm1.png'

const Voucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState(null);
    const [newVoucher, setNewVoucher] = useState({
        id: '',
        name: '',
        description: '',
        discount: ''
    });
    const [voucherToEdit, setVoucherToEdit] = useState({
        id: '',
        name: '',
        description: '',
        discount: ''
    });
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
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
                search: searchTerm
            }
        })
            .then((response) => {
                if (response.data.status) {
                    setVouchers(response.data.data);
                    setTotalPages(response.data.pagination.last_page);
                    setError(null);
                } else {
                    setVouchers([]);
                    setTotalPages(1);
                    setError(null);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setVouchers([]);
                setError('Terjadi kesalahan saat mengambil data');
                setLoading(false);
            });
    }, [currentPage, searchTerm]);

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
        setCurrentPage(1);
    };

    const resetSearch = () => {
        setSearchTerm('');
        setSearchInput('');
        setCurrentPage(1);
    };

    const openDeleteDialog = (voucher) => {
        setVoucherToDelete(voucher);
        setShowDeleteDialog(true);
    };

    const openDetailDialog = (voucher) => {
        setSelectedVoucher(voucher);
        setShowDetailDialog(true);
    };

    const openEditDialog = (voucher) => {
        setVoucherToEdit(voucher);
        setShowEditDialog(true);
    };

    const closeEditDialog = () => {
        setShowEditDialog(false);
        setVoucherToEdit(null);
    };

    const closeDetailDialog = () => {
        setShowDetailDialog(false);
        setSelectedVoucher(null);
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setVoucherToDelete(null);
    };

    const deleteVoucher = async () => {
        if (voucherToDelete) {
            const token = Cookies.get('token');
            if (!token) {
                setError('Token tidak ditemukan, silakan login kembali');
                setTimeout(() => {
                    navigate('/');
                }, 200);
                return;
            }

            try {
                await axios.delete(`https://skripsi-api-859835962101.asia-southeast2.run.app/voucher/${voucherToDelete.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setVouchers(vouchers.filter(vouchers => vouchers.id !== voucherToDelete.id));
                handleCloseDialog();
            } catch (error) {
                console.error("Error deleting voucher:", error);
                setError('Terjadi kesalahan saat menghapus voucher');
                handleCloseDialog();
            }
        }
    };

    const handleCreateVoucher = () => {
        setLoading2(true);

        const token = Cookies.get('token');
        if (!token) {
            setError('Token tidak ditemukan, silakan login kembali');
            setLoading2(false);
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
            })
            .finally(() => {
                setLoading2(false);
            });
    };

    const updateVoucher = () => {
        setLoading2(true);

        const token = Cookies.get('token');
        if (!token) {
            setError('Token tidak ditemukan, silakan login kembali');
            setLoading2(false);
            setTimeout(() => {
                navigate('/');
            }, 200);
            return;
        }

        axios.put(
            `https://skripsi-api-859835962101.asia-southeast2.run.app/voucher/${voucherToEdit.id}`,
            voucherToEdit,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => {
                if (response.data.status) {
                    setVouchers([...vouchers, newVoucher]);
                    setShowEditDialog(false);
                    setVoucherToEdit(null);
                } else {
                    setError('Gagal membuat voucher');
                }
            })
            .catch((error) => {
                console.error("Error creating voucher:", error);
                setError('Terjadi kesalahan saat membuat voucher');
            })
            .finally(() => {
                setLoading2(false);
            });
    };

    const handleCloseDialog = () => {
        setShowCreateDialog(false);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="font-medium text-blue-300 text-3xl mt-20">Daftar Voucher</h1>
            <div className="flex items-center gap-4 mt-10">
                <button
                    onClick={() => setShowCreateDialog(true)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-800 text-white rounded-lg"
                >
                    Tambah Voucher
                </button>
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </div>
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari voucher..."
                            value={searchInput}
                            onChange={handleSearchInput}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </form>
                </div>
            </div>

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
                            {vouchers.length > 0 ? (
                                vouchers.map((voucher, index) => (
                                    <tr key={voucher.id} className="odd:bg-white even:bg-gray-50 border-b">
                                        <td className="px-6 py-3">{index + 1}</td>
                                        <td className="px-6 py-3">{voucher.id}</td>
                                        <td className="px-6 py-3">{voucher.name}</td>
                                        <td className="px-6 py-3">{voucher.discount}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditDialog(voucher)}
                                                    className="text-white bg-blue-300 hover:bg-blue-500 font-medium rounded-lg text-sm px-3 py-2 flex items-center">
                                                    <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteDialog(voucher)}
                                                    className="text-white bg-red-500 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDetailDialog(voucher)}
                                                    className="text-white bg-green-500 hover:bg-green-700 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-gray-500 text-lg font-medium">Data belum tersedia</p>
                                            {searchTerm && (
                                                <p className="text-gray-400 mt-2">
                                                    Tidak ada voucher yang sesuai dengan pencarian "{searchTerm}"
                                                </p>
                                            )}
                                            <button
                                                onClick={resetSearch}
                                                className="px-4 py-2 bg-blue-300 hover:bg-blue-500 rounded-lg flex items-center gap-2 mt-4"
                                            >
                                                <FontAwesomeIcon icon={faArrowLeft} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {vouchers.length > 0 && (
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
                )}
            </div>

            {showDeleteDialog && voucherToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus voucher ini?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => deleteVoucher(voucherToDelete?.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                            >
                                Hapus
                            </button>
                            <button
                                onClick={closeDeleteDialog}
                                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditDialog && voucherToEdit && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg p-12">
                        <h2 className="text-lg font-bold text-blue-300 mb-8">Edit Voucher</h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div className="mb-4">
                                <h4 className='mb-2'>Kode Voucher:</h4>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={voucherToEdit.id}
                                    onChange={(e) => setVoucherToEdit({ ...voucherToEdit, id: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <h4 className='mb-2'>Nama Voucher:</h4>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={voucherToEdit.name}
                                    onChange={(e) => setVoucherToEdit({ ...voucherToEdit, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <h4 className='mb-2'>Deskripsi:</h4>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={voucherToEdit.description}
                                    onChange={(e) => setVoucherToEdit({ ...voucherToEdit, description: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <h4 className='mb-2'>Diskon:</h4>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={voucherToEdit.discount}
                                    onChange={(e) =>
                                        setVoucherToEdit({
                                            ...voucherToEdit,
                                            discount: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            <div className="flex justify-center gap-6 mt-8">
                                {loading2 ? (
                                    <div className="flex justify-center items-center mt-5">
                                        <div className="animate-spin-3d h-24 w-24">
                                            <img src={DM1} alt="Loading" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={updateVoucher}
                                            className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700"
                                        >
                                            Simpan
                                        </button>
                                        <button
                                            onClick={closeEditDialog}
                                            className="py-2 px-4 text-black bg-gray-300 rounded-lg shadow-lg hover:bg-gray-500"
                                        >
                                            Tutup
                                        </button>
                                    </>
                                )}
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {showDetailDialog && selectedVoucher && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg p-12">
                        <h1 className='text-blue-300 text-lg font-bold mb-8'>Detail Voucher</h1>
                        <div className="mb-4">
                            <h4 className="mb-2">Nama Voucher:</h4>
                            <input
                                type="text"
                                value={selectedVoucher.name}
                                readOnly
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <h4 className="mb-2">Kode Voucher:</h4>
                            <input
                                type="text"
                                value={selectedVoucher.id}
                                readOnly
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <h4 className="mb-2">Diskon:</h4>
                            <input
                                type="text"
                                value={selectedVoucher.discount}
                                readOnly
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-8">
                            <h4 className="mb-2">Deskripsi:</h4>
                            <input
                                type="text"
                                value={selectedVoucher.description}
                                readOnly
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <button
                            onClick={closeDetailDialog}
                            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {showCreateDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg p-12">
                        <h2 className="text-lg font-bold text-blue-300 mb-8">Buat Voucher Baru</h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div className="mb-4">
                                <h4 className='mb-2'>Kode Voucher:</h4>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newVoucher.id}
                                    onChange={(e) => setNewVoucher({ ...newVoucher, id: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <h4 className='mb-2'>Nama Voucher:</h4>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newVoucher.name}
                                    onChange={(e) => setNewVoucher({ ...newVoucher, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <h4 className='mb-2'>Deskripsi:</h4>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newVoucher.description}
                                    onChange={(e) => setNewVoucher({ ...newVoucher, description: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <h4 className='mb-2'>Diskon:</h4>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newVoucher.discount}
                                    onChange={(e) =>
                                        setNewVoucher({
                                            ...newVoucher,
                                            discount: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            <div className="flex justify-center gap-6 mt-8">
                                {loading2 ? (
                                    <div className="flex justify-center items-center mt-5">
                                        <div className="animate-spin-3d h-24 w-24">
                                            <img src={DM1} alt="Loading" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCreateVoucher}
                                            className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700"
                                        >
                                            Simpan
                                        </button>
                                        <button
                                            onClick={handleCloseDialog}
                                            className="py-2 px-4 bg-gray-300 text-black rounded-lg shadow-lg hover:bg-gray-500"
                                        >
                                            Tutup
                                        </button>
                                    </>
                                )}
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Voucher;
