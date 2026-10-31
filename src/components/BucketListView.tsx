import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BucketPlace } from '../types';
import { ArrowLeft, Plus, Search, MapPin, Edit3, Trash2, Star } from 'lucide-react';

export const BucketListView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveBucketPlace, deleteBucketPlace } = useApp();

  const [activeCountry, setActiveCountry] = useState<'ALL' | 'India' | 'UAE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Modals
  const [viewPlace, setViewPlace] = useState<BucketPlace | null>(null);
  const [editPlace, setEditPlace] = useState<BucketPlace | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Form State
  const [country, setCountry] = useState('India');
  const [stateName, setStateName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [category, setCategory] = useState('Nature');
  const [rating, setRating] = useState('5');
  const [notes, setNotes] = useState('');

  // Unique states & districts
  const statesSet = new Set<string>();
  const districtsSet = new Set<string>();

  data.bucketList.forEach((p) => {
    if (activeCountry === 'ALL' || p.country.toLowerCase() === activeCountry.toLowerCase()) {
      if (p.state) statesSet.add(p.state);
      if (p.district) districtsSet.add(p.district);
    }
  });

  const filteredPlaces = data.bucketList.filter((p) => {
    const matchCountry =
      activeCountry === 'ALL' || p.country.toLowerCase() === activeCountry.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.placeName.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q);
    const matchState = !selectedState || p.state === selectedState;
    const matchDistrict = !selectedDistrict || p.district === selectedDistrict;

    return matchCountry && matchSearch && matchState && matchDistrict;
  });

  const openAdd = () => {
    setEditPlace(null);
    setCountry(activeCountry === 'UAE' ? 'UAE' : 'India');
    setStateName('');
    setDistrictName('');
    setPlaceName('');
    setImageUrl('');
    setMapLink('');
    setCategory('Nature');
    setRating('5');
    setNotes('');
    setShowFormModal(true);
  };

  const openEdit = (place: BucketPlace) => {
    setEditPlace(place);
    setCountry(place.country);
    setStateName(place.state);
    setDistrictName(place.district);
    setPlaceName(place.placeName);
    setImageUrl(place.imageUrl || '');
    setMapLink(place.mapLink || '');
    setCategory(place.category);
    setRating(String(place.rating || 5));
    setNotes(place.notes || '');
    setShowFormModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName.trim()) {
      alert('Place name is required!');
      return;
    }
    saveBucketPlace(
      {
        country,
        state: stateName.trim(),
        district: districtName.trim(),
        placeName: placeName.trim(),
        imageUrl: imageUrl.trim() || undefined,
        mapLink: mapLink.trim() || undefined,
        category,
        rating: parseInt(rating, 10) || 5,
        notes: notes.trim() || undefined
      },
      editPlace ? editPlace.id : undefined
    );
    setShowFormModal(false);
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          🏖️ Travel Bucket List
        </span>
        <button
          onClick={openAdd}
          className="py-1.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Place
        </button>
      </div>

      {/* Country Filter Tabs */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => {
            setActiveCountry('ALL');
            setSelectedState('');
            setSelectedDistrict('');
          }}
          className={`relative overflow-hidden rounded-2xl p-2 text-center border transition-all cursor-pointer ${
            activeCountry === 'ALL'
              ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div
            className="h-10 rounded-xl bg-cover bg-center mb-1.5"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&auto=format&fit=crop&q=80')"
            }}
          />
          <span className="text-xs font-bold text-slate-800">🌍 All View</span>
        </button>

        <button
          onClick={() => {
            setActiveCountry('India');
            setSelectedState('');
            setSelectedDistrict('');
          }}
          className={`relative overflow-hidden rounded-2xl p-2 text-center border transition-all cursor-pointer ${
            activeCountry === 'India'
              ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div
            className="h-10 rounded-xl bg-cover bg-center mb-1.5"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&auto=format&fit=crop&q=80')"
            }}
          />
          <span className="text-xs font-bold text-slate-800">🇮🇳 India</span>
        </button>

        <button
          onClick={() => {
            setActiveCountry('UAE');
            setSelectedState('');
            setSelectedDistrict('');
          }}
          className={`relative overflow-hidden rounded-2xl p-2 text-center border transition-all cursor-pointer ${
            activeCountry === 'UAE'
              ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div
            className="h-10 rounded-xl bg-cover bg-center mb-1.5"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&auto=format&fit=crop&q=80')"
            }}
          />
          <span className="text-xs font-bold text-slate-800">🇦🇪 UAE</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search place, state, or district..."
            className="w-full text-xs font-medium bg-transparent focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="">All States</option>
            {Array.from(statesSet).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="">All Districts</option>
            {Array.from(districtsSet).map((dst) => (
              <option key={dst} value={dst}>
                {dst}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredPlaces.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl p-8 text-center text-xs text-slate-400 border border-slate-100">
            No Places Found
          </div>
        ) : (
          filteredPlaces.map((item) => (
            <div
              key={item.id}
              onClick={() => setViewPlace(item)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div
                className="h-28 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url('${
                    item.imageUrl ||
                    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&auto=format&fit=crop&q=80'
                  }')`
                }}
              >
                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {item.category || 'General'}
                </span>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate">
                    {item.district || item.state || item.country}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1 mt-0.5 group-hover:text-blue-600 transition-colors">
                    {item.placeName}
                  </h4>
                </div>

                <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-slate-50">
                  {item.mapLink ? (
                    <a
                      href={item.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      Map
                    </a>
                  ) : (
                    <span />
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(item);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* VIEW MORE DETAIL MODAL */}
      {viewPlace && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="relative h-48 bg-slate-800">
              <img
                src={
                  viewPlace.imageUrl ||
                  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80'
                }
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setViewPlace(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-sm font-bold backdrop-blur-xs"
              >
                ✕
              </button>
              <span className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                {viewPlace.category || 'General'}
              </span>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {viewPlace.district || viewPlace.state}
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {viewPlace.placeName}
                </h3>
                <div className="flex justify-between items-center text-xs text-slate-500 mt-1 pb-3 border-b border-slate-100">
                  <span>{[viewPlace.state, viewPlace.country].filter(Boolean).join(', ')}</span>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: viewPlace.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-700 mb-1">
                  📝 Notes &amp; Details:
                </div>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl min-h-[60px] leading-relaxed whitespace-pre-line border border-slate-100">
                  {viewPlace.notes || 'No notes provided.'}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {viewPlace.mapLink && (
                  <a
                    href={viewPlace.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-red-500" />
                    Open Map
                  </a>
                )}
                <button
                  onClick={() => {
                    const target = viewPlace;
                    setViewPlace(null);
                    openEdit(target);
                  }}
                  className="py-2.5 px-3.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-xl transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${viewPlace.placeName}"?`)) {
                      deleteBucketPlace(viewPlace.id);
                      setViewPlace(null);
                    }
                  }}
                  className="py-2.5 px-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-black text-slate-900 mb-3">
              {editPlace ? 'Edit Place' : 'Add New Place'}
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="India">India</option>
                  <option value="UAE">UAE</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Karnataka / Ajman"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">District</label>
                  <input
                    type="text"
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                    placeholder="e.g. Dakshina Kannada"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Place Name *
                </label>
                <input
                  type="text"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="e.g. Ajman Museum"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Google Map Link
                </label>
                <input
                  type="url"
                  value={mapLink}
                  onChange={(e) => setMapLink(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Nature">Nature</option>
                    <option value="Historical">Historical</option>
                    <option value="Beach">Beach</option>
                    <option value="Adventure">Adventure</option>
                    <option value="City">City</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Timings, entry fees, best months to visit..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 leading-relaxed"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs rounded-xl shadow-md shadow-blue-500/20"
                >
                  Save Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
