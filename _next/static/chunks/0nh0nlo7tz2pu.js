(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,91382,e=>{"use strict";var t=e.i(56883),i=e.i(78434),n=e.i(79602),o=e.i(67725);let r="active_focus_organization_id",a=["Not considered"];function p(e){let t=(0,o.today)();return[e.dueAt&&e.dueAt<t?0:1,+!e.isFocus,"High"===e.priority?0:"Medium"===e.priority?1:2,e.dueAt??"9999"]}let d=e=>`focus_steps:${e}`;e.s(["ACT_NOW",0,["Interested","Preparing","Applied","Interviewing","Offer"],"FOCUS_KEY",0,r,"FOCUS_STEPS",0,[{key:"teams",label:"Teams"},{key:"roles",label:"Roles"},{key:"people",label:"People"},{key:"fit",label:"Fit & gaps"},{key:"act",label:"Decide & act"},{key:"next",label:"Move on"}],"INVESTIGATE",0,["Discovered","Investigating"],"doneSteps",0,function(e){let i=(0,t.one)("select value v from settings where key = ?",d(e))?.v;try{return i?JSON.parse(i):[]}catch{return[]}},"focusOpps",0,function(e){return(0,i.oppsWhere)("op.org_id = ? and op.archived_at is null and op.status not in ('Rejected','Withdrawn','Closed')",e)},"focusOrgId",0,function(){let e=(0,t.one)("select value v from settings where key = ?",r)?.v??null;return e&&(0,t.one)("select id from organizations where id = ?",e)?e:null},"focusPapers",0,function(e){return(0,t.all)(`select distinct p.id, p.title, p.why_saved whySaved, p.read, p.url
     from paper_orgs po join papers p on p.id = po.paper_id
     where po.org_id = ? and p.read = 0 order by p.created_at, p.title`,e)},"focusPeople",0,function(e){return(0,t.all)(`select distinct pe.id, pe.name, a.position, t.name teamName, pe.contact_status contactStatus, pe.overlap,
       pe.next_follow_up_at nextFollowUpAt
     from person_affiliations a join people pe on pe.id = a.person_id left join teams t on t.id = a.team_id
     where a.org_id = ? and a.current = 1 and pe.archived_at is null and pe.is_me = 0
       and pe.contact_status not in (${a.map(e=>`'${e}'`).join(",")})
     order by pe.name collate nocase`,e)},"focusRecent",0,function(e,i=5){let o=new Set((0,t.all)(`select n.id from notes n where ${n.IMPORT_NOTE_SQL}`).map(e=>e.id)),r=new Set((0,t.all)("select id from activity where org_id = ? and entity_type in ('opportunity','application')",e).map(e=>e.id));return(0,n.orgTimeline)(e).filter(e=>"note"===e.kind?!o.has(e.id):"interaction"===e.kind||r.has(e.id)).slice(0,i)},"focusSignals",0,function(e){let i=i=>(0,t.one)(i,e)?.c??0;return{discoveredOpps:i("select count(*) c from opportunities where org_id = ? and archived_at is null and status = 'Discovered'"),peopleMapped:i("select count(distinct a.person_id) c from person_affiliations a join people p on p.id = a.person_id where a.org_id = ? and a.current = 1 and p.archived_at is null"),peopleResearchFirst:i("select count(distinct a.person_id) c from person_affiliations a join people p on p.id = a.person_id where a.org_id = ? and a.current = 1 and p.archived_at is null and p.contact_status = 'Research first'"),applicationsInProgress:i("select count(*) c from opportunities where org_id = ? and archived_at is null and status in ('Applied','Interviewing','Offer')"),awaitingReplies:i("select count(*) c from interactions i where i.awaiting_reply = 1 and (i.org_id = ?1 or i.person_id in (select person_id from person_affiliations where org_id = ?1))")}},"focusTasksFor",0,function(e){return(0,i.orgTasks)(e).filter(e=>"done"!==e.status&&!(e.snoozedUntil&&e.snoozedUntil>(0,o.today)())).sort((e,t)=>{let i=p(e),n=p(t);for(let e=0;e<i.length;e++)if(i[e]!==n[e])return i[e]<n[e]?-1:1;return 0})},"lastFocusedAt",0,function(){return new Map((0,t.all)("select org_id orgId, max(at) at from activity where verb = 'focused' and org_id is not null group by org_id").map(e=>[e.orgId,e.at]))},"stepsKey",0,d])},78434,e=>{"use strict";var t=e.i(56883);let i=`t.id, t.title, t.due_at dueAt, t.priority, t.status, t.waiting_on waitingOn, t.waiting_since waitingSince,
  t.is_focus isFocus, t.completed_at completedAt, t.notes, t.snoozed_until snoozedUntil`;function n(e,...o){var r=(0,t.all)(`select distinct ${i} from tasks t left join task_links tl on tl.task_id = t.id where ${e}
      order by t.status = 'done', t.due_at is null, t.due_at, case t.priority when 'High' then 0 when 'Medium' then 1 else 2 end, t.created_at`,...o);if(!r.length)return[];let a=(0,t.all)(`select tl.task_id taskId, tl.id linkId,
       case when tl.org_id is not null then 'org' when tl.team_id is not null then 'team'
            when tl.person_id is not null then 'person' when tl.opportunity_id is not null then 'opportunity'
            when tl.application_id is not null then 'application' else 'paper' end type,
       coalesce(tl.org_id, tl.team_id, tl.person_id, tl.opportunity_id, tl.application_id, tl.paper_id) id,
       coalesce(o.name, tm.name, p.name, op.title, aop.title, pa.title) label
     from task_links tl
     left join organizations o on o.id = tl.org_id
     left join teams tm on tm.id = tl.team_id
     left join people p on p.id = tl.person_id
     left join opportunities op on op.id = tl.opportunity_id
     left join applications ap on ap.id = tl.application_id left join opportunities aop on aop.id = ap.opportunity_id
     left join papers pa on pa.id = tl.paper_id
     where tl.task_id in (${r.map(()=>"?").join(",")})`,...r.map(e=>e.id));return r.map(e=>({...e,links:a.filter(t=>t.taskId===e.id).map(({linkId:e,type:t,id:i,label:n})=>({linkId:e,type:t,id:i,label:n}))}))}e.s(["oppsWhere",0,function(e,...i){return(0,t.all)(`select op.id, op.title, op.type, op.status, op.priority, op.deadline, op.location, op.url, op.team_id teamId,
       t.name teamName, o.id orgId, o.name orgName, o.ring orgRing, op.next_action nextAction, op.fit_notes fitNotes,
       op.discovered_at discoveredAt, op.verified_at verifiedAt, op.source_label sourceLabel, op.source_url sourceUrl,
       op.archived_at archivedAt, (select id from applications a where a.opportunity_id = op.id) applicationId,
       op.research_areas researchAreas, op.created_at createdAt
     from opportunities op join organizations o on o.id = op.org_id left join teams t on t.id = op.team_id
     where ${e} order by op.deadline is null, op.deadline, op.title`,...i)},"orgNetwork",0,function(e){return{people:(0,t.all)(`select p.id, p.name, t.name teamName, p.connection_path connectionPath, p.connection_detail connectionDetail,
       p.relationship_strength relationshipStrength, p.contact_status contactStatus, p.last_interaction_at lastInteractionAt,
       (select count(*) from interactions i where i.person_id = p.id) interactions
     from person_affiliations a join people p on p.id = a.person_id left join teams t on t.id = a.team_id
     where a.org_id = ? and a.current = 1 and p.archived_at is null
     order by case p.relationship_strength when 'Strong' then 0 when 'Moderate' then 1 when 'Weak' then 2 else 3 end, p.name`,e),bridges:(0,t.all)(`select r.id, r.kind, r.notes, f.id fromId, f.name fromName, f.relationship_strength fromStrength, f.contact_status fromStatus,
       tp.id toId, tp.name toName
     from relationships r join people f on f.id = r.from_person_id join people tp on tp.id = r.to_person_id
     where r.to_person_id in (select person_id from person_affiliations where org_id = ?1 and current = 1)
        or r.from_person_id in (select person_id from person_affiliations where org_id = ?1 and current = 1)`,e)}},"orgTasks",0,function(e,t=!1){return n(`(tl.org_id = ?1 or tl.team_id in (select id from teams where org_id = ?1)
      or tl.person_id in (select person_id from person_affiliations where org_id = ?1 and current = 1)
      or tl.opportunity_id in (select id from opportunities where org_id = ?1))
     ${t?"":"and t.status != 'done'"}`,e)},"tasksWhere",0,n])},79602,e=>{"use strict";var t=e.i(56883);let i=`(n.created_at < '2026-09-28T10:15' and n.occurred_at = '2026-09-28' and (
  n.body like 'Imported from tracker.%' or n.body like 'Opening state:%' or
  n.body like 'Deep-dive reference for%' or n.body like 'Work authorization / visa:%'))`;function n(e,...o){let r=(0,t.all)(`select distinct n.id, n.body, n.kind, n.occurred_at occurredAt, n.created_at createdAt, n.source_url sourceUrl,
       n.source_label sourceLabel, n.verified_at verifiedAt, ${i} imported
     from notes n left join note_links nl on nl.note_id = n.id where ${e}`,...o);if(!r.length)return[];let a=(0,t.all)(`select nl.note_id noteId,
       case when nl.org_id is not null then 'org' when nl.team_id is not null then 'team'
            when nl.person_id is not null then 'person' when nl.opportunity_id is not null then 'opportunity'
            when nl.application_id is not null then 'application' else 'paper' end type,
       coalesce(nl.org_id, nl.team_id, nl.person_id, nl.opportunity_id, nl.application_id, nl.paper_id) id,
       coalesce(o.name, t.name, p.name, op.title, aop.title, pa.title) label
     from note_links nl
     left join organizations o on o.id = nl.org_id
     left join teams t on t.id = nl.team_id
     left join people p on p.id = nl.person_id
     left join opportunities op on op.id = nl.opportunity_id
     left join applications ap on ap.id = nl.application_id left join opportunities aop on aop.id = ap.opportunity_id
     left join papers pa on pa.id = nl.paper_id
     where nl.note_id in (${r.map(()=>"?").join(",")})`,...r.map(e=>e.id));return r.map(e=>({id:e.id,kind:"note",at:`${e.occurredAt}T${e.createdAt.slice(11)}`,body:e.body,noteKind:e.kind,sourceUrl:e.sourceUrl,sourceLabel:e.sourceLabel,verifiedAt:e.verifiedAt,about:a.filter(t=>t.noteId===e.id).map(({type:e,id:t,label:i})=>({type:e,id:t,label:i})),imported:!!e.imported}))}function o(e,...i){return(0,t.all)(`select i.id, i.type, i.occurred_at occurredAt, i.created_at createdAt, i.summary, i.direction,
       i.awaiting_reply awaitingReply, p.id personId, p.name personName, ip.name introducerName
     from interactions i join people p on p.id = i.person_id left join people ip on ip.id = i.introducer_id
     where ${e}`,...i).map(e=>({id:e.id,kind:"interaction",at:`${e.occurredAt}T${e.createdAt.slice(11)}`,body:"Introduction"===e.type?`${e.introducerName??"Someone"} introduced me to ${e.personName}${e.summary?`. ${e.summary}`:""}`:`${e.type} ${"inbound"===e.direction?"from":"with"} ${e.personName}${e.summary?` — ${e.summary}`:""}`,interactionType:e.type,awaitingReply:!!e.awaitingReply,about:[{type:"person",id:e.personId,label:e.personName}]}))}function r(e,...i){return(0,t.all)(`select a.id, a.at, a.summary, a.entity_type entityType, a.entity_id entityId, a.verb, o.id orgId, o.name orgName
     from activity a left join organizations o on o.id = a.org_id where ${e.replace(/\b(org_id|entity_type|entity_id)\b/g,"a.$1")}`,...i).filter(e=>"interaction"!==e.entityType).map(e=>({id:e.id,kind:"activity",at:e.at,body:e.summary,verb:e.verb,about:e.orgId&&e.orgName?[{type:"org",id:e.orgId,label:e.orgName}]:[]}))}let a=(e,t)=>t.at.localeCompare(e.at);e.s(["IMPORT_NOTE_SQL",0,i,"globalTimeline",0,function(e=400,t={}){return[...n(t.includeImports?"1 = 1":`not ${i}`),...o("1 = 1"),...r("entity_type != 'note'")].sort(a).slice(0,e)},"importNoteCount",0,function(){return(0,t.all)(`select count(*) c from notes n where ${i}`)[0].c},"opportunityTimeline",0,function(e){return[...n("nl.opportunity_id = ?1 or nl.application_id in (select id from applications where opportunity_id = ?1)",e),...o("i.opportunity_id = ?",e),...r("(entity_type = 'opportunity' and entity_id = ?1) or (entity_type = 'application' and entity_id in (select id from applications where opportunity_id = ?1))",e)].sort(a)},"orgTimeline",0,function(e){return[...n(`(nl.org_id = ?1 or nl.team_id in (select id from teams where org_id = ?1)
    or nl.person_id in (select person_id from person_affiliations where org_id = ?1)
    or nl.opportunity_id in (select id from opportunities where org_id = ?1))`,e),...o("i.org_id = ?1 or i.person_id in (select person_id from person_affiliations where org_id = ?1)",e),...r("org_id = ? and entity_type != 'note'",e)].sort(a)},"personTimeline",0,function(e){return[...n("nl.person_id = ?",e),...o("i.person_id = ?1 or i.introducer_id = ?1",e),...r("entity_type = 'person' and entity_id = ?",e)].sort(a)}])}]);