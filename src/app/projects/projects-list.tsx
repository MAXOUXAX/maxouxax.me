"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "~/trpc/react";
import { ProjectCard } from "~/components/project-card";
import { ProjectCardSkeleton } from "~/components/project-card-skeleton";
import { Field, FieldGroup } from "~/components/ui/field";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Kbd } from "~/components/ui/kbd";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { Spinner } from "~/components/ui/spinner";

const ITEMS_PER_PAGE = 12;

export function ProjectsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const { data: projects, isLoading } = api.projects.getAll.useQuery();

  // Handle keyboard shortcut for search (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        document.getElementById("project-search")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    if (!searchQuery) return projects;

    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.owner.toLowerCase().includes(query) ||
        project.fullName.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  // Handle search with debounce effect
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    setIsSearching(false);
  }, [searchQuery]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Paginate filtered projects
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <FieldGroup>
        <Field>
          <Label htmlFor="project-search">Search projects</Label>
          <div className="relative">
            <Input
              id="project-search"
              type="text"
              placeholder="Search by name, description, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-16"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isSearching && <Spinner className="h-4 w-4" />}
              <Kbd>/</Kbd>
            </div>
          </div>
        </Field>
      </FieldGroup>

      {/* Results count */}
      {!isLoading && (
        <div className="text-sm text-muted-foreground">
          {filteredProjects.length === 0 ? (
            <span>No projects found</span>
          ) : (
            <span>
              Showing {paginatedProjects.length} of {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </span>
          )}
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))
          : paginatedProjects.map((project) => (
              <ProjectCard
                key={project.fullName}
                name={project.name}
                description={project.description}
                visibility={project.visibility}
                lastCommitDate={project.lastCommitDate}
                fullName={project.fullName}
                owner={project.owner}
                ownerType={project.ownerType}
              />
            ))}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page as number);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Empty state */}
      {!isLoading && filteredProjects.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects found matching &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
