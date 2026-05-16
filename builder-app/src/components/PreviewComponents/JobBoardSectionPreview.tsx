import React, { useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { JobBoardSectionProps, Job, JobFilter } from '@/types/component.types';
import {
  colorPalettes,
  getScrollAnimation,
  getBorderRadius,
  getCardStyle,
} from '@/utils/designSystem';

interface JobBoardSectionPreviewProps {
  props: JobBoardSectionProps;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const JobBoardSectionPreview: React.FC<JobBoardSectionPreviewProps> = ({
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading,
    subheading,
    jobs,
    backgroundColor,
    showFilters = true,
    showSearch = true,
    defaultFilters,
    colorScheme = 'professional',
    scrollAnimation = 'fade',
    cardStyle = 'elevated',
    borderRadius = 'lg',
    staggerDelay = 100,
  } = props;

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const animation = getScrollAnimation(scrollAnimation);
  const scheme = colorPalettes[colorScheme];

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [filters, setFilters] = useState<JobFilter>(defaultFilters || {});
  const [expandedFilters, setExpandedFilters] = useState({
    datePosted: true,
    jobType: true,
    salaryRange: true,
    workMode: true,
  });

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      const matchesKeyword = !searchKeyword ||
        job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.company.toLowerCase().includes(searchKeyword.toLowerCase());

      const matchesLocation = !searchLocation ||
        job.location.toLowerCase().includes(searchLocation.toLowerCase());

      // Date filter
      const matchesDate = !filters.datePosted || filters.datePosted === 'any-time' || (() => {
        const postedDate = new Date(job.datePosted);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (filters.datePosted) {
          case 'last-24h': return diffDays <= 1;
          case 'last-week': return diffDays <= 7;
          case 'last-month': return diffDays <= 30;
          default: return true;
        }
      })();

      // Job type filter
      const matchesJobType = !filters.jobType || filters.jobType.length === 0 ||
        filters.jobType.includes(job.jobType);

      // Work mode filter
      const matchesWorkMode = !filters.workMode || filters.workMode.length === 0 ||
        filters.workMode.includes(job.workMode);

      return matchesKeyword && matchesLocation && matchesDate && matchesJobType && matchesWorkMode;
    });
  }, [jobs, searchKeyword, searchLocation, filters]);

  const toggleJobType = (type: 'full-time' | 'part-time' | 'freelance') => {
    setFilters((prev) => {
      const currentTypes = prev.jobType || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter((t) => t !== type)
        : [...currentTypes, type];
      return { ...prev, jobType: newTypes };
    });
  };

  const toggleWorkMode = (mode: 'on-site' | 'hybrid' | 'remote') => {
    setFilters((prev) => {
      const currentModes = prev.workMode || [];
      const newModes = currentModes.includes(mode)
        ? currentModes.filter((m) => m !== mode)
        : [...currentModes, mode];
      return { ...prev, workMode: newModes };
    });
  };

  const getJobTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'part-time':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'freelance':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getWorkModeBadgeStyle = (mode: string) => {
    switch (mode) {
      case 'remote':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'hybrid':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'on-site':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <section
      ref={ref}
      onClick={onSelect}
      className={cn(
        'py-16 px-4 transition-all cursor-pointer',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Search */}
        <div className="text-center mb-12">
          <motion.h2
            initial={animation.initial}
            animate={isInView ? animation.animate : animation.initial}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            {heading}
          </motion.h2>

          {subheading && (
            <motion.p
              initial={animation.initial}
              animate={isInView ? animation.animate : animation.initial}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 mb-8"
            >
              {subheading}
            </motion.p>
          )}

          {/* Search Bar */}
          {showSearch && (
            <motion.div
              initial={animation.initial}
              animate={isInView ? animation.animate : animation.initial}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-4"
            >
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search Job title or Keyword"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <button
                onClick={(e) => e.stopPropagation()}
                className="px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: scheme.primary }}
              >
                Search
              </button>
            </motion.div>
          )}
        </div>

        {/* Job Count */}
        <motion.div
          initial={animation.initial}
          animate={isInView ? animation.animate : animation.initial}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg border-2 border-gray-300">
            <span className="font-semibold text-gray-900">Total Jobs</span>
            <span className="ml-3 px-3 py-1 bg-white rounded border border-gray-300 text-sm font-bold">
              {filteredJobs.length} job results
            </span>
          </div>
        </motion.div>

        {/* Main Content: Filters + Job Listings */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.aside
              initial={animation.initial}
              animate={isInView ? animation.animate : animation.initial}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className={cn(getCardStyle(cardStyle), getBorderRadius(borderRadius), 'p-6')}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters({});
                      setSearchKeyword('');
                      setSearchLocation('');
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    ↺
                  </button>
                </div>

                {/* Date Posted Filter */}
                <div className="mb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedFilters((prev) => ({ ...prev, datePosted: !prev.datePosted }));
                    }}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <span className="font-semibold text-gray-900">Date posted</span>
                    <span className="text-gray-400">{expandedFilters.datePosted ? '▼' : '▶'}</span>
                  </button>

                  {expandedFilters.datePosted && (
                    <div className="space-y-2 ml-1">
                      {['last-24h', 'last-week', 'last-month', 'any-time'].map((period) => (
                        <label key={period} className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name="datePosted"
                            checked={filters.datePosted === period}
                            onChange={() => setFilters({ ...filters, datePosted: period as any })}
                            onClick={(e) => e.stopPropagation()}
                            className="mr-3 w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {period === 'last-24h' && 'Last 24th'}
                            {period === 'last-week' && 'Last Week'}
                            {period === 'last-month' && 'Last Month'}
                            {period === 'any-time' && 'Any time'}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Job Type Filter */}
                <div className="mb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedFilters((prev) => ({ ...prev, jobType: !prev.jobType }));
                    }}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <span className="font-semibold text-gray-900">Job type</span>
                    <span className="text-gray-400">{expandedFilters.jobType ? '▼' : '▶'}</span>
                  </button>

                  {expandedFilters.jobType && (
                    <div className="space-y-2 ml-1">
                      {['full-time', 'part-time', 'freelance'].map((type) => (
                        <label key={type} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.jobType?.includes(type as any) || false}
                            onChange={() => toggleJobType(type as any)}
                            onClick={(e) => e.stopPropagation()}
                            className="mr-3 w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Salary Range Filter */}
                <div className="mb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedFilters((prev) => ({ ...prev, salaryRange: !prev.salaryRange }));
                    }}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <span className="font-semibold text-gray-900">Salary Range</span>
                    <span className="text-gray-400">{expandedFilters.salaryRange ? '▼' : '▶'}</span>
                  </button>

                  {expandedFilters.salaryRange && (
                    <div className="space-y-2 ml-1">
                      {[
                        { label: 'Under $1000', max: 1000 },
                        { label: '$1000-$2000', min: 1000, max: 2000 },
                        { label: '$2000-$5000', min: 2000, max: 5000 },
                        { label: '$5000+', min: 5000 },
                      ].map((range, idx) => (
                        <label key={idx} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            onClick={(e) => e.stopPropagation()}
                            className="mr-3 w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Work Mode Filter */}
                <div className="mb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedFilters((prev) => ({ ...prev, workMode: !prev.workMode }));
                    }}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <span className="font-semibold text-gray-900">On site/Remote</span>
                    <span className="text-gray-400">{expandedFilters.workMode ? '▼' : '▶'}</span>
                  </button>

                  {expandedFilters.workMode && (
                    <div className="space-y-2 ml-1">
                      {['on-site', 'hybrid', 'remote'].map((mode) => (
                        <label key={mode} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.workMode?.includes(mode as any) || false}
                            onChange={() => toggleWorkMode(mode as any)}
                            onClick={(e) => e.stopPropagation()}
                            className="mr-3 w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                            {mode}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          )}

          {/* Job Listings */}
          <div className="flex-1 space-y-6">
            {filteredJobs.length === 0 ? (
              <motion.div
                initial={animation.initial}
                animate={isInView ? animation.animate : animation.initial}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
              </motion.div>
            ) : (
              filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={animation.initial}
                  animate={isInView ? animation.animate : animation.initial}
                  transition={{ duration: 0.6, delay: 0.5 + index * (staggerDelay / 1000) }}
                  className={cn(
                    getCardStyle(cardStyle),
                    getBorderRadius(borderRadius),
                    'p-6 hover:shadow-2xl transition-all duration-300 group'
                  )}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      {job.logo ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                          {job.company.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 font-medium">{job.company}</p>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <span className={cn('px-3 py-1 rounded-full text-xs font-semibold border', getJobTypeBadgeStyle(job.jobType))}>
                            {job.jobType}
                          </span>
                          <span className={cn('px-3 py-1 rounded-full text-xs font-semibold border', getWorkModeBadgeStyle(job.workMode))}>
                            {job.workMode}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                      {/* Requirements */}
                      {job.requirements && job.requirements.length > 0 && (
                        <ul className="text-sm text-gray-600 mb-4 space-y-1">
                          {job.requirements.slice(0, 2).map((req, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Footer: Location + Apply Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center text-gray-600 text-sm">
                          <span className="mr-2">📍</span>
                          <span className="font-medium">{job.location}</span>
                        </div>

                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="px-6 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: scheme.accent }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

