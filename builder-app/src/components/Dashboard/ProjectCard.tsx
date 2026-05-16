import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import type { Project } from '@/types/api.types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-yellow-100 text-yellow-700',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

const gradientColors = [
  'from-blue-400 to-indigo-500',
  'from-purple-400 to-pink-500',
  'from-teal-400 to-cyan-500',
  'from-orange-400 to-red-500',
  'from-emerald-400 to-green-500',
  'from-fuchsia-400 to-violet-500',
];

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onDelete,
  onDuplicate,
}) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const initial = project.name.charAt(0).toUpperCase();
  const gradientIdx =
    project.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    gradientColors.length;
  const gradient = gradientColors[gradientIdx];

  const handleClick = () => {
    navigate(`/editor/${project.id}`);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Thumbnail */}
        <div className="relative h-40 overflow-hidden">
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={cn(
                'w-full h-full bg-gradient-to-br flex items-center justify-center',
                gradient
              )}
            >
              <span className="text-5xl font-bold text-white/80">{initial}</span>
            </div>
          )}

          {/* Action overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => navigate(`/editor/${project.id}`)}
              className="rounded-full bg-white/90 p-2.5 text-gray-700 hover:bg-white transition-colors"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDuplicate(project.id)}
              className="rounded-full bg-white/90 p-2.5 text-gray-700 hover:bg-white transition-colors"
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="rounded-full bg-white/90 p-2.5 text-red-600 hover:bg-white transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 truncate flex-1">
              {project.name}
            </h3>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                statusStyles[project.status] || statusStyles.draft
              )}
            >
              {statusLabels[project.status] || project.status}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Last edited: {relativeTime(project.updated_at)}
          </p>
        </div>
      </motion.div>

      {/* Delete confirmation */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={() => setShowDeleteDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onDelete(project.id);
              setShowDeleteDialog(false);
            }}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default ProjectCard;
