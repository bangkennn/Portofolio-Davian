import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil semua projects dengan tech stacks
export async function GET() {
  try {
    // Ambil semua projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true });

    if (projectsError) throw projectsError;

    // Ambil semua tech stacks untuk setiap project
    const projectsWithTechStacks = await Promise.all(
      (projects || []).map(async (project) => {
        const { data: techStacks, error: techStacksError } = await supabase
          .from('project_tech_stacks')
          .select('tech_stack_id')
          .eq('project_id', project.id);

        if (techStacksError) {
          return { ...project, tech_stacks: [] };
        }

        const techStackIds = techStacks?.map((ts) => ts.tech_stack_id) || [];

        if (techStackIds.length === 0) {
          return { ...project, tech_stacks: [] };
        }

        const { data: techStacksData, error: techStacksDataError } = await supabase
          .from('tech_stacks')
          .select('*')
          .in('id', techStackIds);

        if (techStacksDataError) {
          return { ...project, tech_stacks: [] };
        }

        return { ...project, tech_stacks: techStacksData || [] };
      })
    );

    return NextResponse.json({ data: projectsWithTechStacks });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Tambah project baru
export async function POST(request: Request) {
  try {
    const { name, description, slug, featured, image_type, image_url, project_url, order, tech_stack_ids } = await request.json();

    if (!name || !description || !slug) {
      return NextResponse.json(
        { error: 'Required fields: name, description, slug' },
        { status: 400 }
      );
    }

    // Insert project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        slug,
        featured: featured || false,
        image_type: image_type || 'desktop',
        image_url: image_url || null,
        project_url: project_url || null,
        order: order || 0,
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Insert tech stacks jika ada
    if (tech_stack_ids && Array.isArray(tech_stack_ids) && tech_stack_ids.length > 0) {
      const projectTechStacks = tech_stack_ids.map((tech_stack_id: number) => ({
        project_id: project.id,
        tech_stack_id,
      }));

      const { error: techStacksError } = await supabase
        .from('project_tech_stacks')
        .insert(projectTechStacks);

      if (techStacksError) {
        // Jika gagal insert tech stacks, hapus project yang baru dibuat
        await supabase.from('projects').delete().eq('id', project.id);
        throw techStacksError;
      }
    }

    // Ambil project dengan tech stacks
    const { data: techStacks } = await supabase
      .from('project_tech_stacks')
      .select('tech_stack_id')
      .eq('project_id', project.id);

    const techStackIds = techStacks?.map((ts) => ts.tech_stack_id) || [];
    const { data: techStacksData } = await supabase
      .from('tech_stacks')
      .select('*')
      .in('id', techStackIds);

    return NextResponse.json(
      { data: { ...project, tech_stacks: techStacksData || [] } },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(request: Request) {
  try {
    const { id, name, description, slug, featured, image_type, image_url, project_url, order, tech_stack_ids } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (slug !== undefined) updateData.slug = slug;
    if (featured !== undefined) updateData.featured = featured;
    if (image_type !== undefined) updateData.image_type = image_type;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (project_url !== undefined) updateData.project_url = project_url;
    if (order !== undefined) updateData.order = order;

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (projectError) throw projectError;

    // Update tech stacks jika ada
    if (tech_stack_ids !== undefined && Array.isArray(tech_stack_ids)) {
      // Hapus semua tech stacks yang ada
      await supabase
        .from('project_tech_stacks')
        .delete()
        .eq('project_id', id);

      // Insert tech stacks baru jika ada
      if (tech_stack_ids.length > 0) {
        const projectTechStacks = tech_stack_ids.map((tech_stack_id: number) => ({
          project_id: id,
          tech_stack_id,
        }));

        const { error: techStacksError } = await supabase
          .from('project_tech_stacks')
          .insert(projectTechStacks);

        if (techStacksError) throw techStacksError;
      }
    }

    // Ambil project dengan tech stacks
    const { data: techStacks } = await supabase
      .from('project_tech_stacks')
      .select('tech_stack_id')
      .eq('project_id', id);

    const techStackIds = techStacks?.map((ts) => ts.tech_stack_id) || [];
    const { data: techStacksData } = await supabase
      .from('tech_stacks')
      .select('*')
      .in('id', techStackIds);

    return NextResponse.json({
      data: { ...project, tech_stacks: techStacksData || [] },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus project
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Hapus project (tech stacks akan terhapus otomatis karena CASCADE)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}

